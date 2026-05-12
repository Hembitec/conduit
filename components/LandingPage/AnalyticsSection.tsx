"use client"
import { BarChart3, TrendingUp, Users } from "lucide-react"

export default function AnalyticsSection() {
  return (
    <section id="analytics" className="w-full px-4 py-24 bg-muted/30 scroll-mt-24">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4">The Insight Engine.</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Understand your audience with real-time analytics. 
          No trackers, no cookies—just pure performance data.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard icon={<TrendingUp className="text-blue-500" />} label="Total Views" value="48.2k" />
        <StatCard icon={<Users className="text-purple-500" />} label="Subscribers" value="1,240" />
        <StatCard icon={<BarChart3 className="text-green-500" />} label="Avg. Reading Time" value="4m 20s" />
      </div>

      {/* Simulated Chart */}
      <div className="max-w-5xl mx-auto bg-card border rounded-2xl p-8 shadow-sm">
         <div className="flex items-end justify-between h-64 gap-2">
            {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85, 40, 75].map((h, i) => (
               <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group transition-all hover:bg-primary/40" style={{ height: `${h}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                     {h * 100} views
                  </div>
               </div>
            ))}
         </div>
      </div>
    </section>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-card border p-6 rounded-2xl flex flex-col items-center">
      <div className="mb-4">{icon}</div>
      <span className="text-muted-foreground text-sm uppercase tracking-widest mb-1">{label}</span>
      <span className="text-3xl font-black">{value}</span>
    </div>
  )
}
