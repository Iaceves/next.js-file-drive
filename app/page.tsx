
"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import UploadButton from "./upload-button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FileCard } from "./file-card";

export default function Home() {

  const organization = useOrganization();
  const user = useUser();


  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }


  const files = useQuery(api.file.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your Files</h1>

        <UploadButton />
      </div>
      <div className="grid grid-cols-4 gap-4 mt-2">
      {files?.map((file) => {
        return <FileCard key={file._id} file={file} />;
      })}
      </div>
      </main>
    </main>
  );
}