"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Pen,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import {
  navEntries,
  isNavGroup,
  isRouteActive,
  isGroupActive,
  type NavItem,
  type NavGroup,
} from "./navData"

interface MobileNavProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  pathname: string
  onSignOut: () => void
}

export function MobileNav({ isOpen, setIsOpen, pathname, onSignOut }: MobileNavProps) {
  const user = useQuery(api.users.currentUser)
  const router = useRouter()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    for (const entry of navEntries) {
      if (isNavGroup(entry) && isGroupActive(entry, pathname)) {
        initial.add(entry.label)
      }
    }
    return initial
  })

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const renderItem = (item: NavItem) => {
    const Icon = item.icon
    const isActive = isRouteActive(item.href, pathname)
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground hover:bg-muted"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-sm font-medium">{item.label}</span>
      </Link>
    )
  }

  const renderGroup = (group: NavGroup) => {
    const Icon = group.icon
    const isOpen = expandedGroups.has(group.label)
    const active = isGroupActive(group, pathname)
    return (
      <div key={group.label}>
        <button
          onClick={() => toggleGroup(group.label)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 text-left",
            active ? "text-primary" : "text-foreground hover:bg-muted"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium flex-1">{group.label}</span>
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
        {isOpen && (
          <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l pl-3">
            {group.children.map(renderItem)}
          </div>
        )}
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50 h-10 w-10 bg-background/95 backdrop-blur-sm border shadow-sm"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
        <SheetHeader className="border-b p-4 text-left shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <div className="flex flex-wrap items-center justify-center gap-[2px] w-4 h-4">
                <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-primary-foreground/70 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-primary-foreground/70 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
              </div>
            </div>
            <div>
              <SheetTitle className="text-base">Conduit CMS</SheetTitle>
              <p className="text-xs text-muted-foreground">Your writing workspace</p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          <nav className="flex flex-col gap-0.5 px-3">
            {navEntries.map((entry) =>
              isNavGroup(entry) ? renderGroup(entry) : renderItem(entry)
            )}
          </nav>
        </div>

        <div className="border-t bg-muted/30 p-4 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email || "Loading..."}</p>
              <p className="text-xs text-muted-foreground">Writer</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9 gap-2 text-xs"
              onClick={() => { setIsOpen(false); router.push("/cms/settings") }}
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 text-xs text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => { setIsOpen(false); onSignOut() }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
