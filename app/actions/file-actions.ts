"use server";

import supabase from "@/lib/supabase/client";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
const currentDate = new Date();
const timestamp = currentDate.getTime();

export async function uploadFile(formData: FormData) {
  console.log("uploading file");
  console.log("formData", formData);
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const user_id = auth().userId;
  const org_id = auth().orgId;
  const filename = `${timestamp}_${file.name}`;

  const { data, error } = (await supabase.storage
    .from("files")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    })) as unknown as { data: { id: string; path: string }; error: Error };

  if (error) {
    // throw new Error(error.message);
    console.log(error.message);
  }

  const { data: fileData, error: fileError } = await supabase
    .from("files")
    .insert({
      id: data?.id,
      title,
      org_id,
      user_id,
      type: file.type,
      file_name: filename,
    });

  if (fileError) {
    console.log("fileError", fileError);
  }

  revalidatePath("/");

  return { fileData, error: fileError, data };
}

export async function getFiles(orgId: string | null | undefined) {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) {
    console.log("error", error);
    return;
  }

  return data;
}

export async function deleteFile(file_name: string) {
  // first check if file exists in the bucket
  console.log("filepath", `files/${file_name}`);
  const { data: fileData, error: fileError } = await supabase.storage
    .from("files")
    .remove([`files/${file_name}`]);
  if (fileError) {
    console.log("fileError", fileError);
    return;
  }
  console.log("fileData", fileData);

  const { data, error } = await supabase
    .from("files")
    .delete()
    .eq("file_name", file_name);
  if (error) {
    console.log("error", error);
    return;
  }

  revalidatePath("/");

  return data;
}
