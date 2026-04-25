import { FileText, Plus, LucideIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  actionLabel?: string
  actionHref?: string
  secondaryActionLabel?: string
  secondaryActionHref?: string
  className?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title,
  description,
  icon: Icon = FileText,
  actionLabel,
  actionHref,
  secondaryActionLabel,
  secondaryActionHref,
  className,
  action
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-1 items-center justify-center rounded-lg border border-dashed bg-muted/20 shadow-sm p-12 min-h-[50vh]",
      "animate-in fade-in-0 slide-in-from-bottom-4 duration-500",
      className
    )}>
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <Icon className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent animate-pulse" />
        </div>
        
        <h3 className="text-xl font-semibold tracking-tight mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {actionLabel && actionHref && (
            <Link href={actionHref}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {actionLabel}
              </Button>
            </Link>
          )}
          {action && (
            <Button variant="outline" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryActionLabel && secondaryActionHref && (
            <Link href={secondaryActionHref}>
              <Button variant="outline">
                {secondaryActionLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
