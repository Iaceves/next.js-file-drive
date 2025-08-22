
"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon } from "lucide-react";
import { useState } from "react";
import { SearchBar } from "./search-input-bar";
import { FileCard } from "./file-card";
import UploadButton from "./upload-button";

import { columns } from "./columns"
import { DataTable } from "./file-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Doc } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">You have no files, upload one now</div>
      <UploadButton />
    </div>
  );
}

export function FileBrowser({title, favoritesOnly, deletedOnly}: {title: string, favoritesOnly: boolean, deletedOnly: boolean}) {

  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");


  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.file.getAllFavorites,
    orgId ? {orgId} : "skip"
  );

  const files = useQuery(api.file.getFiles, orgId 
    ? { orgId, type: type === "all" ? undefined : type, query, favorites: favoritesOnly, deletedOnly } 
    : "skip");

  const isLoading = files === undefined;

  const modifiedFiles = files?.map(file => ({
    ...file,
    isFavorited: (favorites ?? []).some(
      (favorite) => favorite.fileId === file._id
    )
  })) ?? [];

  //this is a helper function for Type filter
//   const typeFilter = ({title, favoritesOnly, deletedOnly}: {title: string, favoritesOnly: boolean, deletedOnly: boolean}) =>{
//       const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

//   <div className="flex gap-2">
//     <Label htmlFor="type-select">Type filter</Label>
//     <Select value={type} onValueChange={(newType) => {
//       setType(newType as any)
//     }}>
//       <SelectTrigger id="type-select" className="w-[180px] text-black-700">
//         <SelectValue />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="all">All</SelectItem>
//         <SelectItem value="image">Image</SelectItem>
//         <SelectItem value="csv">CSV</SelectItem>
//         <SelectItem value="pdf">PDF</SelectItem>
//         <SelectItem value="gif">GIF</SelectItem>
//       </SelectContent>
//     </Select>
//   </div>
// }

  return (
      <div>

        {isLoading && (
          <div className="flex flex-col items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl"> Loading Your Files...</div>
          </div>
        )}


        {!isLoading && files?.length === 0 && ( 
          <div>
            <div className="flex justify-end">
              <Label htmlFor="type-select">Type filter</Label>
              <Select value={type} onValueChange={(newType) => {
                setType(newType as any)
              }}>
                <SelectTrigger id="type-select" className="w-[180px] text-black-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="gif">GIF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-8 w-full items-center mt-20">
              <SearchBar query={query} setQuery={setQuery} />
              <Placeholder />
            </div>
          </div>
          )}
          

          {!isLoading && files.length > 0 && (
              <main className="container mx-auto pt-12">
                <div className="flex justify-between items-center">
                  < h1 className="text-4xl font-bold">{title}</h1>
                  <SearchBar query={query} setQuery={setQuery} />
                  <UploadButton />
                </div>

                <Tabs defaultValue="grid">
                  <div className="flex justify-between items-center">
                    <TabsList className="mb-4">
                      <TabsTrigger value="grid" className="flex gap-2 items-center">
                        <GridIcon />
                        Grid
                      </TabsTrigger>
                      <TabsTrigger value="table" className="flex gap-2 items-center">
                        <RowsIcon />
                        Table
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                      <Label htmlFor="type-select">Type filter</Label>
                      <Select value={type} onValueChange={(newType) => {
                        setType(newType as any)
                      }}>
                        <SelectTrigger id="type-select" className="w-[180px] text-black-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="gif">GIF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <TabsContent value="grid">
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {modifiedFiles?.map((file) => {
                      return <FileCard key={file._id} file={file} />;
                      })}
                    </div>
                  </TabsContent>
                  <TabsContent value="table"><DataTable columns={columns} data={modifiedFiles} /></TabsContent>
                </Tabs>

                {files.length === 0 && <Placeholder />}
              </main>
          )}
      </div>
  );
}

