import supabase from "@/lib/supabase/client";

export const getFileUrl = (file_name: string) => {
  const { data } = supabase.storage.from("files").getPublicUrl(`${file_name}`);

  console.log("imageurl", data);

  return data;
};
