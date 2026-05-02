"use client"
export default function StackSection() {
  return (
    <section className="w-full px-4 py-24 text-center max-w-6xl mx-auto border-t">
       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8 block">Powered by the best in tech</span>
       <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-2xl font-black tracking-tighter">CONVEX</span>
          <span className="text-2xl font-black tracking-tighter">NEXT.JS 16</span>
          <span className="text-2xl font-black tracking-tighter">REACT 19</span>
          <span className="text-2xl font-black tracking-tighter">CLOUDFLARE R2</span>
          <span className="text-2xl font-black tracking-tighter">TAILWIND 4</span>
       </div>
    </section>
  )
}
