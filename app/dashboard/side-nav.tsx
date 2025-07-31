"use client"

import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { FileIcon, StarIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"


export function SideNav(){
  const pathName = usePathname()
    return (
    <div className="w-40 flex flex-col gap-4 justify-start">

          <Link href="/dashboard/files">
            <Button variant="link" className={clsx("flex gap-2", {
              "text-blue-500": pathName.includes("/dashboard/files")
            })}>
              <FileIcon className="flex gap-2" /> All files
            </Button>
          </Link>
            
          <Link href="/dashboard/favorites">
            <Button variant="link" className={clsx("flex gap-2", {
              "text-blue-500": pathName.includes("/dashboard/favorites")
            })}>
              <StarIcon className="flex gap-2" /> Favorites
            </Button>
          </Link>

        </div>
    )
}