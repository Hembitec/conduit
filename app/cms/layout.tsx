import { ReactNode } from "react"
import DashboardSidebar from "./(components)/DashboardSidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar - Fixed position on desktop */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
