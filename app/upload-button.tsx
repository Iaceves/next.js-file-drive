
"use client";

import { Button } from "@/components/ui/button";
import {
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
// import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

export default function UploadButton() {
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.file.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values.file[0],
    });
    const { storageId } = await result.json();

    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
      });

      form.reset();

      setIsFileDialogOpen(false);

      toast("Event has been created, successfully.", 
        {
          description: "Now everyone can view your file",
           action: {
            label: "Close",
            onClick: () => console.log("Close"),
          },
        },
      )
    } catch (err) {
      toast("Something went wrong.", {description: "Your file could not be uploaded, try again later"})
    }
  }

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const createFile = useMutation(api.file.createFile);

  return (
        <Dialog
          open={isFileDialogOpen}
          onOpenChange={(isOpen) => {
            setIsFileDialogOpen(isOpen);
            form.reset();
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => {}}>Upload File</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-8">Upload your File Here</DialogTitle>
              <DialogDescription>
                This file will be accessible by anyone in your organization
              </DialogDescription>
            </DialogHeader>

            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input type="file" {...fileRef} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="flex gap-1"
                  >
                    {form.formState.isSubmitting && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
  );
}