"use client"
import { motion } from "framer-motion"
import { Save, Image as ImageIcon, FileText } from "lucide-react"

export default function EditorSection() {
  return (
    <section id="editor" className="w-full px-4 py-24 max-w-6xl mx-auto scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            A Writing Environment <br />
            <span className="text-primary">That Just Works.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Forget about saving or managing assets. Our TipTap-powered editor handles the heavy lifting so you can focus on your craft.
          </p>
          
          <div className="space-y-6">
            <FeatureItem 
              icon={<Save className="w-5 h-5 text-green-500" />} 
              title="Real-time Auto-save" 
              description="Never lose a word. Every change is debounced and synced to Convex instantly." 
            />
            <FeatureItem 
              icon={<ImageIcon className="w-5 h-5 text-blue-500" />} 
              title="Direct R2 Uploads" 
              description="Drag and drop images directly into your post. We handle the Cloudflare R2 hosting." 
            />
            <FeatureItem 
              icon={<FileText className="w-5 h-5 text-purple-500" />} 
              title="Rich Formatting" 
              description="Full TipTap extension suite including highlights, code blocks, and markdown shortcuts." 
            />
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-card border rounded-2xl overflow-hidden shadow-2xl">
             <div className="bg-muted/50 border-b p-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                   <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Auto-saving...</span>
                </div>
             </div>
             <div className="p-8 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
                <div className="space-y-2">
                   <div className="h-4 bg-muted/60 rounded w-full" />
                   <div className="h-4 bg-muted/60 rounded w-full" />
                   <div className="h-4 bg-muted/60 rounded w-2/3" />
                </div>
                <div className="h-40 bg-muted/40 rounded-xl border-2 border-dashed border-muted flex items-center justify-center">
                   <ImageIcon className="w-8 h-8 text-muted-foreground opacity-20" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
