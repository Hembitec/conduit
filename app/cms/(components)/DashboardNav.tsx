"use client"

import { Profile } from "@/components/Profile"
import { LogOut, Menu } from 'lucide-react'
import { Dialog, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../../../components/ui/sheet"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"

export default function DashboardNavMobile() {
  const router = useRouter();
  const { signOut } = useAuthActions();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="flex h-14 justify-between min-[825px]:justify-end items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Dialog>
        <SheetTrigger className="min-[825px]:hidden p-2 transition">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Conduit CMS</SheetTitle>
            <SheetDescription>
              A modern blog CMS built with Next.js, Convex & TipTap
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col space-y-3 mt-4">
            <DialogClose asChild>
              <Link href="/cms">
                <Button variant="outline" className="w-full">Dashboard</Button>
              </Link>
            </DialogClose>
            <DialogClose asChild>
              <Link href="/cms/documents">
                <Button variant="outline" className="w-full">My Documents</Button>
              </Link>
            </DialogClose>
            <DialogClose asChild>
              <Link href="/cms/publish">
                <Button variant="outline" className="w-full">Publish Article</Button>
              </Link>
            </DialogClose>
            <DialogClose asChild>
              <Link href="/cms/author">
                <Button variant="outline" className="w-full">Create Author</Button>
              </Link>
            </DialogClose>
            <DialogClose asChild>
              <Link href="/cms/category">
                <Button variant="outline" className="w-full">Create Category</Button>
              </Link>
            </DialogClose>
            <DialogClose asChild>
              <Link href="/cms/api">
                <Button variant="outline" className="w-full">API</Button>
              </Link>
            </DialogClose>
            <DialogClose asChild>
              <Link href="/cms/settings">
                <Button variant="outline" className="w-full">Settings</Button>
              </Link>
            </DialogClose>
            <div className="border-t pt-3 mt-3">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Dialog>
      <Profile />
    </header>
  )
}
