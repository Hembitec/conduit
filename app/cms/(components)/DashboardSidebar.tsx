"use client"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  BarChart3,
  BookA,
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
  Key,
  LogOut,
  Menu,
  MessageSquare,
  Pen,
  Settings,
  Tag,
  User,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: "Create",
    items: [
      { label: "Dashboard", href: "/cms", icon: Home },
      { label: "My Documents", href: "/cms/documents", icon: FileText },
      { label: "Publish Article", href: "/cms/publish", icon: BookA },
    ],
  },
  {
    title: "Manage",
    items: [
      { label: "Create Author", href: "/cms/author", icon: User },
      { label: "Create Category", href: "/cms/category", icon: Tag },
    ],
  },
  {
    title: "Configure",
    items: [
      { label: "Comments", href: "/cms/comments", icon: MessageSquare, badge: 0 },
      { label: "Analytics", href: "/cms/analytics", icon: BarChart3 },
    ],
  },
]

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-accent" />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          !isActive && "group-hover:scale-110"
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge ? (
        <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      ) : null}
    </Link>
  )
}

function UserProfileSection({ onSignOut }: { onSignOut: () => void }) {
  const user = useQuery(api.users.currentUser)
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSettingsClick = () => {
    setOpen(false)
    router.push("/cms/settings")
  }

  const handleApiKeysClick = () => {
    setOpen(false)
    router.push("/cms/settings")
  }

  const handleSignOutClick = () => {
    setOpen(false)
    onSignOut()
  }

  return (
    <div className="border-t bg-muted/30 p-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="w-full flex items-center gap-3 p-1.5 rounded-lg hover:bg-muted transition-colors text-left"
          >
            <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.email || "Loading..."}
              </p>
              <p className="text-xs text-muted-foreground">Writer</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 p-1"
          align="start"
          side="top"
          sideOffset={-8}
        >
          <div className="flex flex-col gap-1">
            <button
              onClick={handleSettingsClick}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={handleApiKeysClick}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
            >
              <Key className="h-4 w-4" />
              API Keys
            </button>
            <div className="my-1 border-t" />
            <button
              onClick={handleSignOutClick}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 transition-colors text-left text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function MobileNav({
  isOpen,
  setIsOpen,
  pathname,
  onSignOut,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  pathname: string
  onSignOut: () => void
}) {
  const user = useQuery(api.users.currentUser)
  const router = useRouter()

  const isActiveRoute = (href: string) => {
    if (href === "/cms") {
      return pathname === "/cms"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
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
        {/* Header */}
        <SheetHeader className="border-b p-4 text-left shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Pen className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-base">Conduit CMS</SheetTitle>
              <p className="text-xs text-muted-foreground">Your writing workspace</p>
            </div>
          </div>
        </SheetHeader>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="flex flex-col gap-6 px-3">
            {navSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-1">
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = isActiveRoute(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-md shrink-0 transition-colors",
                            isActive
                              ? "bg-primary-foreground/20"
                              : "bg-muted group-hover:bg-background"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-accent" />}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile - Fixed at bottom */}
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
              onClick={() => {
                setIsOpen(false)
                router.push("/cms/settings")
              }}
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 text-xs text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => {
                setIsOpen(false)
                onSignOut()
              }}
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

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuthActions()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    router.push("/")
  }

  const isActiveRoute = (href: string) => {
    if (href === "/cms") {
      return pathname === "/cms"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileOpen}
        setIsOpen={setMobileOpen}
        pathname={pathname}
        onSignOut={handleSignOut}
      />

      {/* Desktop Sidebar - Fixed position */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[260px] flex-col border-r bg-muted/40 shrink-0">
        {/* Header */}
        <div className="flex h-16 items-center border-b px-6 shrink-0">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-semibold transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Pen className="h-4 w-4" />
            </div>
            <span className="text-lg tracking-tight">Conduit CMS</span>
          </Link>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="flex flex-col gap-6 px-3">
            {navSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-1">
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      isActive={isActiveRoute(item.href)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile - Fixed at bottom */}
        <UserProfileSection onSignOut={handleSignOut} />
      </aside>

      {/* Spacer for desktop to offset fixed sidebar */}
      <div className="hidden md:block w-[260px] shrink-0" />
    </>
  )
}
