"use client"

import { Separator } from '@/components/ui/separator'
import clsx from 'clsx'
import {
  BookA,
  BookCheck,
  Home,
  LogOut,
  NetworkIcon,
  Pen,
  Settings,
  Table
} from "lucide-react"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthActions } from '@convex-dev/auth/react'

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="hidden border-r bg-muted/40 md:block ">
      <div className="flex h-full max-h-screen flex-col gap-2 ">
        <div className="flex  items-center  border-b h-[60px] px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">Conduit CMS</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start text-sm font-medium px-4 gap-[0.2rem]">
            <Link
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/cms" || pathname.includes("/cms/preview/")
              })}
              href="/cms"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/cms/documents" || pathname.includes("/cms/documents/")
              })}
              href="/cms/documents"
            >
              <BookCheck className="h-4 w-4" />
              My Documents
            </Link>
            <Link
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/cms/publish"
              })}
              href="/cms/publish"
            >
              <BookA className="h-4 w-4" />
              Publish Article
            </Link>
            <Link
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/cms/author"
              })}
              href="/cms/author"
            >
              <Pen className="h-4 w-4" />
              Create Author
            </Link>
            <Link
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/cms/category"
              })}
              href="/cms/category"
            >
              <Table className="h-4 w-4" />
              Create Category
            </Link>
            <Separator className="my-3" />
            <Link
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/cms/api"
              })}
              href="/cms/api"
            >
              <NetworkIcon className="h-4 w-4" />
              API
            </Link>
            <Link
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/cms/settings"
              })}
              href="/cms/settings"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="border-t px-4 py-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
