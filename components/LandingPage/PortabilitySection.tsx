"use client"
import { motion } from "framer-motion"
import { Globe, Code2, Smartphone, Zap } from "lucide-react"

export default function PortabilitySection() {
  return (
    <section className="w-full px-4 py-24 bg-black overflow-hidden relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase italic">
            Your Content. <span className="text-primary">Unchained.</span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Conduit isn&apos;t just a website builder—it&apos;s a headless engine. 
            Connect your blog to any platform with our ultra-fast JSON API.
          </p>
        </div>

        <div className="relative flex flex-col items-center">
          
          {/* Central Hub: Conduit API Engine */}
          <div className="relative z-30 mb-24 md:mb-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] bg-zinc-950 border-4 border-primary/20 p-8 flex flex-col items-center justify-center relative shadow-[0_0_100px_rgba(168,85,247,0.15)]"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-3xl mb-6 flex items-center justify-center border border-primary/20">
                <Zap className="w-10 h-10 text-primary fill-primary/20" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-white">CONDUIT</h3>
              <div className="bg-primary/20 text-primary text-[10px] font-black px-4 py-1.5 rounded-full mt-4 tracking-[0.2em] uppercase border border-primary/30">
                THE CORE ENGINE
              </div>
              
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-[3rem] border border-primary/50 animate-ping opacity-20" />
            </motion.div>

            {/* API Endpoint Anchor */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-40">
               <div className="bg-zinc-900 border-2 border-primary px-8 py-3 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <code className="text-white text-sm md:text-base font-mono font-bold tracking-tight">GET /api/blog/all</code>
               </div>
            </div>
          </div>

          {/* Branching Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-20">
            
            <TargetNode 
              icon={<Globe className="w-8 h-8 text-blue-400" />} 
              label="Static Portfolio" 
              framework="NEXT.JS / ASTRO"
              description="Power your personal portfolio site with headless content."
              delay={0.1}
            />
            
            <TargetNode 
              icon={<Code2 className="w-8 h-8 text-orange-400" />} 
              label="Interactive Widget" 
              framework="REACT / WEB COMPONENT"
              description="Embed your latest posts directly into any existing dashboard."
              delay={0.2}
            />
            
            <TargetNode 
              icon={<Smartphone className="w-8 h-8 text-purple-400" />} 
              label="Mobile Reader" 
              framework="REACT NATIVE / EXPO"
              description="Build a native iOS and Android experience with zero backend work."
              delay={0.3}
            />

          </div>

          {/* Desktop Branching Visual (SVG) */}
          <div className="hidden md:block absolute inset-0 -z-10 mt-[200px]">
            <svg width="100%" height="400" viewBox="0 0 1000 400" fill="none">
               {/* Site Path */}
               <motion.path 
                 initial={{ pathLength: 0 }}
                 whileInView={{ pathLength: 1 }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 d="M500,100 C500,200 166,200 166,300" 
                 stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="8 8"
               />
               {/* Widget Path */}
               <motion.path 
                 initial={{ pathLength: 0 }}
                 whileInView={{ pathLength: 1 }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 d="M500,100 L500,300" 
                 stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="8 8"
               />
               {/* App Path */}
               <motion.path 
                 initial={{ pathLength: 0 }}
                 whileInView={{ pathLength: 1 }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 d="M500,100 C500,200 833,200 833,300" 
                 stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="8 8"
               />
               <defs>
                 <linearGradient id="lineGrad" x1="500" y1="100" x2="500" y2="300" gradientUnits="userSpaceOnUse">
                   <stop stopColor="#a855f7" />
                   <stop offset="1" stopColor="#a855f7" stopOpacity="0.1" />
                 </linearGradient>
               </defs>
            </svg>
          </div>

        </div>
      </div>
      
      {/* Background Text Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.02] text-[20vw] font-black leading-none whitespace-nowrap text-white z-0">
        API FIRST API FIRST API FIRST
      </div>
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:40px:40px] opacity-20" />
    </section>
  )
}

function TargetNode({ icon, label, framework, description, delay }: { icon: React.ReactNode, label: string, framework: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 hover:border-primary/50 transition-all duration-500 group"
    >
      <div className="w-20 h-20 bg-zinc-900 rounded-3xl mb-6 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
        {icon}
      </div>
      <h4 className="text-white text-2xl font-bold mb-2 tracking-tight">{label}</h4>
      <span className="text-[10px] font-black text-primary tracking-[0.2em] mb-4 uppercase">{framework}</span>
      <p className="text-sm text-zinc-500 leading-relaxed max-w-[240px]">
        {description}
      </p>
      
      {/* Active stream indicator */}
      <div className="mt-8 w-full h-px bg-zinc-900 overflow-hidden">
         <motion.div 
           animate={{ x: ["-100%", "100%"] }}
           transition={{ repeat: Infinity, duration: 4, delay: delay * 2 }}
           className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
         />
      </div>
    </motion.div>
  )
}

