// import { useOrganization, useUser, useAuth } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs";

import { UploadBtn } from "@/components/upload-form";
import FileCard from "@/components/file-card";
import { getFiles } from "./actions/file-actions";
import Image from "next/image";

export default async function Home() {
  const { userId, orgId } = auth();
  console.log("orgId", orgId);

  const files = await getFiles(orgId);

  return (
    <main className="container mx-auto pt-12 pb-5">
      {files?.length === 0 && (
        <div className="flex flex-col gap-4 items-center justify-center">
          <Image
            width={300}
            height={300}
            src="/empty.svg"
            alt="image for no images"
          />
          <div className="text-xl">
            You have no files go ahead and upload some
          </div>
          <UploadBtn />
        </div>
      )}

      {files && files?.length > 0 && (
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Files</h1>
          <UploadBtn />
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
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
