"use client"

import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    LogOut,
    Settings,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"

export function Profile() {
    const router = useRouter();
    const { signOut } = useAuthActions();

    async function handleSignOut() {
        await signOut();
        router.push("/");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-9 h-9 cursor-pointer">
                <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/cms/settings">
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
