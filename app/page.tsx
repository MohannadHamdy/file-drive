"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useOrganization,
  useSession,
  useUser,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  let orgId = null;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {files?.map((file) => (
        <div key={file._id} className="flex items-center space-x-4">
          <div>{file.name}</div>
        </div>
      ))}

      <Button
        onClick={() => {
          if (!orgId) return;
          createFile({
            name: "hello",
            orgId,
          });
        }}
      >
        click me
      </Button>
    </main>
  );
}
