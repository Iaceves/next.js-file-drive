
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TrashIcon, MoreVertical, ImageIcon, FileTextIcon, GanttChartIcon, Heart, StarsIcon, UndoIcon, FileIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner"      
import Image from "next/image";
import { useQuery } from "convex/react";
import { Protect } from "@clerk/nextjs";
import { formatRelative } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



function FileCardActions ({ file, isFavorited }: {file: Doc<"files"> & { url: string | null }; isFavorited: boolean;}){

    const deleteFile = useMutation(api.file.deleteFile)
    const restoreFile = useMutation(api.file.restoreFile)
    const toggleFavorite = useMutation(api.file.toggleFavorite)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    return (
        <>
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogTrigger></AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will mark the file for our deletion process. Files will be deleted in 30 days for all.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={async() => {
                    // TODO: actually delete the file
                    await deleteFile({
                      fileId: file._id
                    });
                    toast("File marked for Deletion", {description: "Your file will be deleted soon"})
                }}
                >
                    Continue
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <DropdownMenu>
            <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
            <DropdownMenuContent>

                <DropdownMenuItem 
                className="flex gap-1 text-yellow-500 items-center cursor-pointer" 
                onClick={() => 
                    toggleFavorite({
                        fileId: file._id
                    })
                }
                >
                    {isFavorited ? (
                        <div className="flex gap-1 items-center cursor-pointer">
                            <StarsIcon className="w-4 h-4 text-yellow-600" /> Unfavorite
                        </div>
                    ) : (
                        <div className="flex gap-1 items-center cursor-pointer">
                            <Heart className="w-4 h-4 text-red-800"/> Favorite
                        </div>
                    )}
                </DropdownMenuItem>

                <DropdownMenuItem 
                    className="flex gap-1 text-yellow-500 items-center cursor-pointer"
                    onClick={() => {
                     if (!file.url) return;
                        window.open(file.url, "_blank");
                    }}
               >
                    <FileIcon />Download
                </DropdownMenuItem>
        
                <Protect 
                    role="org:admin"
                    fallback={<></>}
                >
                 <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className="flex gap-1 items-center cursor-pointer" 
                    onClick={() => {
                        if(file.shouldDelete){
                            restoreFile({
                                fileId: file._id,
                            })
                        } else {
                        setIsConfirmOpen(true)
                        }
                    }}
                >
                    {file.shouldDelete ? (
                        <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                            <UndoIcon className="w-4 h-4 bg-text-red" />Restore
                        </div>
                    ):(
                        <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                            <TrashIcon className="w-4 h-4 bg-text-red" />Delete
                        </div>
                    )}
                </DropdownMenuItem>
                </Protect >
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}


export function FileCard ({ file, favorites }: {file: Doc<"files">, favorites: Doc<"favorites">[]}){


    const fileUrl = useQuery(api.file.getFileUrl, { fileId: file.fileId });
   
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId,
    });

    const typeIcons = {
      image: < ImageIcon />,
      pdf: <FileTextIcon />,
      csv: <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>


    const isFavorited = favorites.some((favorite) => favorite.fileId === file._id);

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                    <div className="flex justify-center text-base font-normal">
                        {typeIcons[file.type]}
                    </div>{file.name}
                </CardTitle>
                <div className="absolute right-3">
                    <FileCardActions isFavorited={isFavorited} file={file}/>
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

