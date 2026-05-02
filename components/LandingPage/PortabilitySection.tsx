"use client"
import { motion } from "framer-motion"
import { Globe, Code2, Smartphone, Zap } from "lucide-react"

export default function PortabilitySection() {
  return (
    <section className="w-full px-4 py-24 bg-black overflow-hidden relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Total Portability. Zero Friction.
          </h2>
          <h3 className="text-gray-400 text-lg max-w-2xl mx-auto">
            Fetch your content, authors, and metadata using our high-speed JSON API. 
            Build custom frontends, embed widgets, or power native apps without managing a database.
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative">
          {/* Central Hub: Conduit */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-72 h-96 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-900 shadow-[0_0_50px_rgba(59,130,246,0.3)] p-8 flex flex-col items-center justify-center border-4 border-white/20 relative"
          >
            <div className="w-20 h-20 bg-white/20 rounded-2xl mb-6 flex items-center justify-center backdrop-blur-md">
              <Zap className="w-12 h-12 text-white fill-white" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-white">CONDUIT</h3>
            <div className="bg-blue-400/20 text-blue-200 text-[10px] font-bold px-3 py-1 rounded-full mt-2 tracking-widest uppercase">Content API Engine</div>
          </motion.div>

          {/* API Line & Tag */}
          <div className="hidden lg:flex flex-1 items-center justify-center relative h-1 px-4">
             <div className="w-full h-[2px] bg-gradient-to-r from-blue-500/50 to-transparent relative">
                <motion.div 
                  animate={{ left: ["0%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute top-[-4px] w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#3b82f6]"
                />
             </div>
             <div className="absolute top-[-20px] bg-black border border-blue-500/50 px-4 py-2 rounded-xl backdrop-blur-xl">
                <code className="text-blue-400 text-xs font-mono">GET /api/blog/all</code>
             </div>
          </div>

          {/* Targets */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6 w-full lg:w-96">
            <TargetCard icon={<Globe className="text-blue-400" />} title="External Site" tech="NEXT.JS" />
            <TargetCard icon={<Code2 className="text-orange-400" />} title="Live Widget" tech="WIDGET" />
            <TargetCard icon={<Smartphone className="text-purple-400" />} title="Mobile Native" tech="FLUTTER" />
          </div>
        </div>
      </div>
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:30px_30px] opacity-50" />
    </section>
  )
}

function TargetCard({ icon, title, tech }: { icon: React.ReactNode, title: string, tech: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, x: 10 }}
      className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm group hover:border-blue-500/50 transition-all flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">{icon}</div>
        <span className="font-bold text-white text-lg">{title}</span>
      </div>
      <span className="text-[10px] font-bold text-blue-400 tracking-tighter border border-blue-400/30 px-2 py-1 rounded">{tech}</span>
    </motion.div>
  )
}
