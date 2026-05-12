"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ChevronDown,
  ChevronRight,
  Key,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Pen,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect } from "react"
import {
  navEntries,
  isNavGroup,
  isRouteActive,
  isGroupActive,
  type NavItem,
  type NavGroup,
} from "./navData"
import { MobileNav } from "./MobileNav"
import { FolderNav } from "./FolderNav"

// ─── Collapsed icon link (tooltip on hover) ─────────────────────

function CollapsedNavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
            isActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  )
}

// ─── Collapsed group icon (expands sidebar on click) ─────────────

function CollapsedGroupIcon({
  group,
  isActive,
  onExpand,
}: {
  group: NavGroup
  isActive: boolean
  onExpand: () => void
}) {
  const Icon = group.icon
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onExpand}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
            isActive
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {group.label}
      </TooltipContent>
    </Tooltip>
  )
}

// ─── Expanded nav link ───────────────────────────────────────────

function ExpandedNavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200", !isActive && "group-hover:scale-110")} />
      <span className="truncate">{item.label}</span>
    </Link>
  )
}

// ─── Expanded collapsible group ──────────────────────────────────

function ExpandedGroup({
  group,
  pathname,
  isOpen,
  onToggle,
}: {
  group: NavGroup
  pathname: string
  isOpen: boolean
  onToggle: () => void
}) {
  const Icon = group.icon
  const active = isGroupActive(group, pathname)

  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 text-left",
          active ? "text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{group.label}</span>
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="ml-5 mt-0.5 flex flex-col gap-0.5 border-l pl-2">
          {group.children.map((child) => (
            <ExpandedNavLink
              key={child.href}
              item={child}
              isActive={isRouteActive(child.href, pathname)}
            />
          ))}
          {group.label === "Outreach" && (
            <FolderNav pathname={pathname} />
          )}
        </div>
      )}
    </div>
  )
}

// ─── User profile (bottom of sidebar) ────────────────────────────

function UserProfile({ collapsed, onSignOut }: { collapsed: boolean; onSignOut: () => void }) {
  const user = useQuery(api.users.currentUser)
  const router = useRouter()
  const [open, setOpen] = useState(false)

  if (collapsed) {
    return (
      <div className="border-t p-2 flex justify-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="rounded-lg p-1.5 hover:bg-muted transition-colors">
              <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-1" align="start" side="right" sideOffset={8}>
            <p className="px-3 py-2 text-sm font-medium truncate border-b mb-1">
              {user?.email || "Loading..."}
            </p>
            <button onClick={() => { setOpen(false); router.push("/cms/settings") }} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left w-full">
              <Settings className="h-4 w-4" /> Settings
            </button>
            <button onClick={() => { setOpen(false); router.push("/cms/settings") }} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left w-full">
              <Key className="h-4 w-4" /> API Keys
            </button>
            <div className="my-1 border-t" />
            <button onClick={() => { setOpen(false); onSignOut() }} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 transition-colors text-left w-full text-destructive">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <div className="border-t bg-muted/30 p-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="w-full flex items-center gap-3 p-1.5 rounded-lg hover:bg-muted transition-colors text-left">
            <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email || "Loading..."}</p>
              <p className="text-xs text-muted-foreground">Writer</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-1" align="start" side="top" sideOffset={-8}>
          <button onClick={() => { setOpen(false); router.push("/cms/settings") }} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left w-full">
            <Settings className="h-4 w-4" /> Settings
          </button>
          <button onClick={() => { setOpen(false); router.push("/cms/settings") }} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left w-full">
            <Key className="h-4 w-4" /> API Keys
          </button>
          <div className="my-1 border-t" />
          <button onClick={() => { setOpen(false); onSignOut() }} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 transition-colors text-left w-full text-destructive">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ─── Main Sidebar ────────────────────────────────────────────────

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuthActions()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Auto-expand groups that contain the active route
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    for (const entry of navEntries) {
      if (isNavGroup(entry) && isGroupActive(entry, pathname)) {
        initial.add(entry.label)
      }
    }
    return initial
  })

  // Persist collapsed state
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed")
    if (stored === "true") setCollapsed(true)
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", String(!prev))
      return !prev
    })
  }

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  async function handleSignOut() {
    await signOut()
    router.push("/")
  }

  const sidebarWidth = collapsed ? "w-[60px]" : "w-[260px]"

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile */}
      <MobileNav isOpen={mobileOpen} setIsOpen={setMobileOpen} pathname={pathname} onSignOut={handleSignOut} />

      {/* Desktop Sidebar */}
      <aside className={cn("hidden md:flex fixed left-0 top-0 h-screen flex-col border-r bg-muted/40 shrink-0 transition-all duration-200 z-30", sidebarWidth)}>
        {/* Header */}
        <div className={cn("flex items-center border-b shrink-0 h-14", collapsed ? "justify-center px-2" : "justify-between px-4")}>
          {collapsed ? (
            <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-80 transition-opacity">
              <div className="flex flex-wrap items-center justify-center gap-[2px] w-4 h-4">
                <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-primary-foreground/70 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-primary-foreground/70 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
              </div>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2.5 font-semibold hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <div className="flex flex-wrap items-center justify-center gap-[2px] w-4 h-4">
                  <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-primary-foreground/70 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-primary-foreground/70 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                </div>
              </div>
              <span className="text-lg tracking-tight">Conduit</span>
            </Link>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={toggleCollapsed} title="Collapse sidebar">
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto py-3">
          <nav className={cn("flex flex-col gap-0.5", collapsed ? "items-center px-1.5" : "px-3")}>
            {navEntries.map((entry) => {
              if (isNavGroup(entry)) {
                if (collapsed) {
                  return (
                    <CollapsedGroupIcon
                      key={entry.label}
                      group={entry}
                      isActive={isGroupActive(entry, pathname)}
                      onExpand={() => { setCollapsed(false); localStorage.setItem("sidebar-collapsed", "false"); setExpandedGroups((prev) => new Set(prev).add(entry.label)) }}
                    />
                  )
                }
                return (
                  <ExpandedGroup
                    key={entry.label}
                    group={entry}
                    pathname={pathname}
                    isOpen={expandedGroups.has(entry.label)}
                    onToggle={() => toggleGroup(entry.label)}
                  />
                )
              }
              if (collapsed) {
                return <CollapsedNavLink key={entry.href} item={entry} isActive={isRouteActive(entry.href, pathname)} />
              }
              return <ExpandedNavLink key={entry.href} item={entry} isActive={isRouteActive(entry.href, pathname)} />
            })}
          </nav>
        </div>

        {/* Expand button (collapsed mode) */}
        {collapsed && (
          <div className="flex justify-center py-2 border-t">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={toggleCollapsed} title="Expand sidebar">
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* User Profile */}
        <UserProfile collapsed={collapsed} onSignOut={handleSignOut} />
      </aside>

      {/* Spacer */}
      <div className={cn("hidden md:block shrink-0 transition-all duration-200", sidebarWidth)} />
    </TooltipProvider>
  )
}
