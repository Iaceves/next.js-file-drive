
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";

import { ImageIcon, FileTextIcon, GanttChartIcon } from "lucide-react";

import { ReactNode } from "react";
import { api } from "@/convex/_generated/api";      
import Image from "next/image";
import { useQuery } from "convex/react";
import { FileCardActions } from "./file-actions";
import { formatRelative } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



export function FileCard ({ file }: {file: Doc<"files"> & {isFavorited: boolean}}){


    const fileUrl = useQuery(api.file.getFileUrl, { fileId: file.fileId });
   
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId,
    });

    const typeIcons = {
      image: < ImageIcon />,
      pdf: <FileTextIcon />,
      csv: <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>


    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                    <div className="flex justify-center text-base font-normal">
                        {typeIcons[file.type]}
                    </div>{file.name}
                </CardTitle>
                <div className="absolute right-3">
                    <FileCardActions isFavorited={file.isFavorited} file={file}/>
                </div>
           
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center">
                
                {
                    file.type === "image" && (
                        <Image alt={file.name} width={200} height={100} src={fileUrl || `/placeholder.${file.type}`} />
                    )
                }

                {
                    file.type === "csv" && <GanttChartIcon className="w-20 h-20" />
                }
                {
                    file.type === "pdf" && <FileTextIcon className="w-20 h-20" />
                }
                {
                    file.type === "gif" && (
                        <Image alt={file.name} width={200} height={100} src={fileUrl || `/placeholder.${file.type}`} />
                    )
                }
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex gap-2 text-xs text-gray-700 w-30 items-center">
                <Avatar className="w-6 h-6">
                    <AvatarImage src={userProfile?.image} />
                    <AvatarFallback>{userProfile?.name}</AvatarFallback>
                </Avatar>
                    {userProfile?.name}
                </div>
                <div className="text-xs text-gray-700 w-36">Uploaded on {formatRelative(new Date(file._creationTime), new Date())} </div>
            </CardFooter>
        </Card>
    ) 
}

