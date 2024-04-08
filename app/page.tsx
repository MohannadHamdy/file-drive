"use client";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { UploadBtn } from "@/components/uploadBtn";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  let orgId = null;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <UploadBtn />
      </div>

      {files?.map((file) => (
        <div key={file._id} className="flex items-center space-x-4">
          <div>{file.name}</div>
        </div>
      ))}
    </main>
  );
}
