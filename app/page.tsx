// "use client";
// import { useOrganization, useUser, useAuth } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs";

import { UploadBtn } from "@/components/upload-form";
import FileCard from "@/components/file-card";
import supabase from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { getFiles } from "./actions/file-actions";

export default async function Home() {
  const { userId, orgId } = auth();
  console.log("orgId", orgId);

  const files = await getFiles(orgId);
  // console.log("files", files);

  const addFile = async () => {
    const { error, data } = await supabase
      .from("files")
      .insert({
        name: "file",
        // org_id: organization.organization?.id,
        org_id: "organization.organization?.id",
        user_id: "userId",
      })
      .select();
    if (error) {
      console.log("error", error);
      return;
    }

    console.log("data", data);
  };

  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <UploadBtn />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => <FileCard key={file.id} file={file} />)}
      </div>

      {/* <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => (
          <div className="text-grey-500" key={file.id}>
            {file.title}
          </div>
        ))}
      </div> */}
    </main>
  );
}
