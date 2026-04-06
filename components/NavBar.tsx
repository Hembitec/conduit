"use client"

import {
    NavigationMenu,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { BookOpen, Menu } from 'lucide-react';
import Link from "next/link"
import * as React from "react"
import { Button } from "./ui/button"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Dialog, DialogClose } from "@radix-ui/react-dialog"


export function NavBar() {
    return (
        <div className="flex min-w-full justify-between p-2 border-b z-10">
            <Dialog>
                <SheetTrigger className="min-[825px]:hidden p-2 transition">
                    <Menu />
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>SupaNext CMS</SheetTitle>
                        <SheetDescription>
                            An opensource blog CMS built using Nextjs, Supabase & TipTap
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col space-y-3 mt-4">
                        <DialogClose asChild>
                            <Link href="/">
                                <Button variant="outline" className="w-full">Home</Button>
                            </Link>
                        </DialogClose>
                        <DialogClose asChild>
                            <Link href="/cms">
                                <Button variant="outline" className="w-full">Dashboard</Button>
                            </Link>
                        </DialogClose>
                    </div>
                </SheetContent>
            </Dialog>

            <NavigationMenu>
                <NavigationMenuList className="max-[825px]:hidden ">
                    <Link href="/" className="pl-2">
                        <BookOpen />
                    </Link>
                </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-3">
                <Link href="/sign-in">
                    <Button variant="outline" size="sm">Sign In</Button>
                </Link>
            </div>
        </div>
    )
}
