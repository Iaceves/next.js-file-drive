
"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import UploadButton from "./upload-button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Home() {

  const organization = useOrganization();
  const user = useUser();


  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }


  const files = useQuery(api.file.getFiles, orgId ? { orgId } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    
    {isLoading && 
      <div className="flex flex-col align-items items-center">
        <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
        <div className="text-2xl"> Loading your images...</div>
      </div>
    }

      {!isLoading && files?.length === 0 && ( 
          <div className="flex flex-col gap-8 w-full items-center mt-20">
            <Image 
              alt="an empty holder icon"
              width="300"
              height="300"
              src="/empty.svg"
            />
            <div className="text-2xl">
            You have no files, upload one now.
            </div>
            <UploadButton />
          </div>
        )}

        {!isLoading && files.length > 0 && (
          <>
            <main className="container mx-auto pt-12">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">Your Files</h1>

            <UploadButton />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-2">
          {files?.map((file) => {
            return <FileCard key={file._id} file={file} />;
          })}
          </div>
          </main>
          </>
        )}
    
    </main>
  );
}