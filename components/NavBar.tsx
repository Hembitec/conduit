"use client"

import { BookOpen, Menu, ChevronDown, PenLine } from 'lucide-react';
import Link from "next/link"
import * as React from "react"
import { Button } from "./ui/button"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Dialog, DialogClose } from "@radix-ui/react-dialog"
import { usePathname } from 'next/navigation';

export function NavBar() {
    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
            <div className="flex items-center justify-between rounded-full bg-background/70 backdrop-blur-lg border border-border/50 shadow-sm px-4 py-2.5">
                <Dialog>
                    <SheetTrigger className="min-[825px]:hidden p-2 transition">
                        <Menu className="h-5 w-5" />
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                    <PenLine className="h-4 w-4 text-primary-foreground" />
                                </div>
                                Conduit CMS
                            </SheetTitle>
                            <SheetDescription>
                                A modern blog CMS built using Next.js & Convex
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col space-y-3 mt-6">
                            <DialogClose asChild>
                                <Link href="/">
                                    <Button variant="ghost" className="w-full justify-start text-base">Home</Button>
                                </Link>
                            </DialogClose>

                            <DialogClose asChild>
                                <a href="/#editor">
                                    <Button variant="ghost" className="w-full justify-start text-base">Editor</Button>
                                </a>
                            </DialogClose>
                            <DialogClose asChild>
                                <a href="/#analytics">
                                    <Button variant="ghost" className="w-full justify-start text-base">Analytics</Button>
                                </a>
                            </DialogClose>
                            <DialogClose asChild>
                                <a href="/#seo">
                                    <Button variant="ghost" className="w-full justify-start text-base">SEO</Button>
                                </a>
                            </DialogClose>
                            <div className="h-px bg-border my-2" />
                            <DialogClose asChild>
                                <Link href="/sign-in">
                                    <Button variant="outline" className="w-full text-base">Sign In</Button>
                                </Link>
                            </DialogClose>
                            <DialogClose asChild>
                                <Link href="/sign-up">
                                    <Button className="w-full text-base">Get started</Button>
                                </Link>
                            </DialogClose>
                        </div>
                    </SheetContent>
                </Dialog>

                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-2 pl-2 hover:opacity-80 transition-opacity">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <div className="flex flex-wrap items-center justify-center gap-[2px] w-4 h-4">
                            <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-primary-foreground/70 rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-primary-foreground/70 rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                        </div>
                    </div>
                </Link>

                {/* Center: Links */}
                <div className="hidden min-[825px]:flex items-center gap-8 text-sm font-medium text-foreground/80">

                    <a href="/#editor" className="hover:text-foreground transition-colors">
                        Editor
                    </a>
                    <a href="/#analytics" className="hover:text-foreground transition-colors">
                        Analytics
                    </a>
                    <a href="/#seo" className="hover:text-foreground transition-colors">
                        SEO
                    </a>
                </div>

                {/* Right: Auth */}
                <div className="hidden min-[825px]:flex items-center gap-3">
                    <Link href="/sign-in" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors px-3 py-2">
                        Sign In
                    </Link>
                    <Link href="/sign-up">
                        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-none font-medium px-5">
                            Get started
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
