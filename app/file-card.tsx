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
import { Doc } from "@/convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TrashIcon, MoreVertical } from "lucide-react";

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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
// import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

function FileCardActions ({ file }: {file: Doc<"files">}){

    const deleteFile = useMutation(api.file.deleteFile)
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

export function FileCard ({file}: {file: Doc<"files">}){
    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle>{file.name}</CardTitle>
                <div className="absolute right-3">
                    <FileCardActions file={file}/>
                </div>
                {/* <CardDescription>Card Description</CardDescription> */}
                {/* <CardAction>Card Action</CardAction> */}
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                {/* <p>Card Footer</p> */}
                <Button>Download</Button>
            </CardFooter>
        </Card>
    ) 
}

