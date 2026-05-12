import {
  BarChart3,
  BookA,
  ClipboardList,
  FileText,
  Home,
  Inbox,
  Layers,
  LayoutTemplate,
  Mail,
  Megaphone,
  MessageSquare,
  Newspaper,
  Send,
  Settings,
  Tag,
  Tags,
  User,
  Users,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  icon: LucideIcon
  children: NavItem[]
}

export type NavEntry = NavItem | NavGroup

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry
}

export function isRouteActive(href: string, pathname: string): boolean {
  if (href === "/cms") return pathname === "/cms"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function isGroupActive(group: NavGroup, pathname: string): boolean {
  return group.children.some((item) => isRouteActive(item.href, pathname))
}

export const navEntries: NavEntry[] = [
  { label: "Command Center", href: "/cms", icon: Home },
  {
    label: "Publishing",
    icon: Newspaper,
    children: [
      { label: "Articles", href: "/cms/articles", icon: Newspaper },
      { label: "Documents", href: "/cms/documents", icon: FileText },
      { label: "Publish", href: "/cms/publish", icon: BookA },
    ]
  },
  {
    label: "Taxonomies",
    icon: Layers,
    children: [
      { label: "Authors", href: "/cms/author", icon: User },
      { label: "Categories", href: "/cms/category", icon: Tag },
      { label: "Tags", href: "/cms/tags", icon: Tags },
    ],
  },
  {
    label: "Audience",
    icon: Users,
    children: [
      { label: "Subscribers", href: "/cms/subscribers", icon: Users },
      { label: "Comments", href: "/cms/comments", icon: MessageSquare },
    ]
  },
  {
    label: "Outreach",
    icon: Megaphone,
    children: [
      { label: "Leads", href: "/cms/outreach/leads", icon: Users },
      { label: "Templates", href: "/cms/outreach/templates", icon: LayoutTemplate },
      { label: "Compose", href: "/cms/outreach/compose", icon: Mail },
      { label: "Campaigns", href: "/cms/outreach/campaigns", icon: Megaphone },
      { label: "Analytics", href: "/cms/outreach/analytics", icon: Send },
    ],
  },
  {
    label: "System",
    icon: Settings,
    children: [
      { label: "Blog Analytics", href: "/cms/analytics", icon: BarChart3 },
      { label: "Feedback", href: "/cms/feedback", icon: Inbox },
      { label: "Surveys", href: "/cms/surveys", icon: ClipboardList },
      { label: "API Docs", href: "/cms/api", icon: FileText },
    ]
  }
]
