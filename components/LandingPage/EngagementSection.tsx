"use client"
import { Mail, MessageSquare } from "lucide-react"

export default function EngagementSection() {
  return (
    <section className="w-full px-4 py-24 bg-primary text-primary-foreground overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
           <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Grow Your Tribe.</h2>
           <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
             Conduit isn't just for writing—it's for building a community. 
             Capture emails with our newsletter engine and manage discussions with built-in comments.
           </p>
           
           <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex gap-4 items-start">
                 <div className="p-3 bg-white/10 rounded-xl"><Mail className="w-6 h-6" /></div>
                 <div>
                    <h4 className="font-bold">Newsletter</h4>
                    <p className="text-sm opacity-80">Capture subscribers directly on your blog posts.</p>
                 </div>
              </div>
              <div className="flex gap-4 items-start">
                 <div className="p-3 bg-white/10 rounded-xl"><MessageSquare className="w-6 h-6" /></div>
                 <div>
                    <h4 className="font-bold">Moderated Comments</h4>
                    <p className="text-sm opacity-80">Approve or delete comments from your dashboard.</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="relative">
           <div className="bg-white/5 border border-white/20 rounded-2xl p-8 backdrop-blur-sm">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20" />
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                 </div>
                 <div className="h-20 bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="h-2 bg-white/10 rounded w-full mb-2" />
                    <div className="h-2 bg-white/10 rounded w-2/3" />
                 </div>
                 <div className="flex justify-end">
                    <div className="h-8 bg-white/20 rounded-md w-24" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  )
}
