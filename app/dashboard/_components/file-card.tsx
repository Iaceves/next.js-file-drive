import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "@/convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TrashIcon, MoreVertical, ImageIcon, FileTextIcon, GanttChartIcon, Heart, StarsIcon } from "lucide-react";

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



function FileCardActions ({ file, isFavorited }: {file: Doc<"files">; isFavorited: boolean; }){

    const deleteFile = useMutation(api.file.deleteFile)
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
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={async() => {
                    // TODO: actually delete the file
                    await deleteFile({
                      fileId: file._id
                    });
                    toast("File Deleted", {description: "Your file is deleted from the system"})
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
                className="flex gap-1 text-yellow-500 items-center" 
                onClick={() => 
                    toggleFavorite({
                        fileId: file._id
                    })
                }
                >
                    {isFavorited ? (
                        <div className="flex gap-1 items-center">
                            <StarsIcon className="w-4 h-4 text-yellow-600" /> Unfavorite
                        </div>
                    ) : (
                        <div className="flex gap-1 items-center">
                            <Heart className="w-4 h-4 text-red-800"/> Favorite
                        </div>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                className="flex gap-1 text-red-600 items-center" 
                onClick={() => setIsConfirmOpen(true)}
                >
                    <TrashIcon className="w-4 h-4 bg-text-red" />
                    Delete
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}


export function FileCard ({ file, favorites }: {file: Doc<"files">, favorites: Doc<"favorites">[]}){

    const fileUrl = useQuery(api.file.getFileUrl, { fileId: file.fileId });

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
                    <div className="flex justify-center">
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
                        <Image alt={file.name} width={200} height={100} src={fileUrl || "/placeholder.png"} />
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
                        <Image alt={file.name} width={200} height={100} src={fileUrl || "/placeholder.gif"} />
                    )
                }
            </CardContent>
            <CardFooter className="flex justify-center items-center">
                <Button onClick={() => {
                    // open a new tab to the file location on convex
                    fileUrl && window.open(fileUrl, "_blank")
                }}>Download</Button>
            </CardFooter>
        </Card>
    ) 
}

