"use client"
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignedIn } from "@clerk/clerk-react";
import { SignedOut, SignIn, SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

export default function Home() {
  const session = useSession();
  const createFile = useMutation(api.file.createFile)
  const files = useQuery(api.file.getFiles)
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <SignedIn>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>

      {files?.map(file => {
        return <div key={file._id}>{file.name}</div>
      })}

      <Button onClick={() => {
        createFile({
          name: "hello World!"
        })
      }}>Click Me</Button>
    </div>
  );
}
