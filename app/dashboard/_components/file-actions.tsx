"use client"
import { Doc } from "@/convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TrashIcon, MoreVertical, Heart, StarsIcon, UndoIcon, FileIcon } from "lucide-react";

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
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner"      
import { Protect } from "@clerk/nextjs";


export function FileCardActions ({ file, isFavorited }: {file: Doc<"files"> & { url: string | null }; isFavorited: boolean;}){

    const deleteFile = useMutation(api.file.deleteFile)
    const restoreFile = useMutation(api.file.restoreFile)
    const toggleFavorite = useMutation(api.file.toggleFavorite)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const me = useQuery(api.users.getMe);

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
                    condition={(check) => {
                        return check({
                            role: "org:admin",
                        }) || file.userId === me?._id;
                    }}
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