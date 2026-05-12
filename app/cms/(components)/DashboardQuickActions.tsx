"use client";

import Link from "next/link";
import { Plus, LayoutTemplate, UserPlus, Send, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_ACTIONS = [
  {
    label: "New Article",
    href: "/cms/publish",
    icon: <Plus className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    label: "New Template",
    href: "/cms/outreach/templates/new",
    icon: <LayoutTemplate className="h-4 w-4" />,
    variant: "secondary" as const,
  },
  {
    label: "Add Leads",
    href: "/cms/outreach/leads",
    icon: <UserPlus className="h-4 w-4" />,
    variant: "secondary" as const,
  },
  {
    label: "Start Campaign",
    href: "/cms/outreach/compose",
    icon: <Send className="h-4 w-4" />,
    variant: "secondary" as const,
  },
  {
    label: "Settings",
    href: "/cms/settings",
    icon: <Settings className="h-4 w-4" />,
    variant: "ghost" as const,
  },
];

export function DashboardQuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {QUICK_ACTIONS.map((action) => (
        <Button
          key={action.href}
          variant={action.variant}
          size="sm"
          className="gap-2"
          asChild
        >
          <Link href={action.href}>
            {action.icon}
            {action.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
