
"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import { useState } from "react";
import { SearchBar } from "./search-input-bar";
import { FileCard } from "./file-card";
import UploadButton from "./upload-button";


export function FileBrowser({title, favoritesOnly}: {title: string, favoritesOnly: boolean}) {

  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");


  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.file.getAllFavorites,
    orgId ? {orgId} : "skip"
  );

  const files = useQuery(api.file.getFiles, orgId ? { orgId, query, favorites: favoritesOnly } : "skip");
  const isLoading = files === undefined;

  return (
   
      <div>
        {isLoading && 
          <div className="flex flex-col items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl"> Loading your images...</div>
          </div>
        }

        {!isLoading && files?.length === 0 && ( 
            <div className="flex flex-col gap-8 w-full items-center mt-20">
              <SearchBar query={query} setQuery={setQuery} />
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
                  < h1 className="text-4xl font-bold">{title}</h1>
                  <SearchBar query={query} setQuery={setQuery} />
                  <UploadButton />
                </div>
    
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {files?.map((file) => {
                    return <FileCard favorites={favorites ?? []} key={file._id} file={file} />;
                  })}
                </div>
              </main>
            </>
          )}
      </div>
  );
}