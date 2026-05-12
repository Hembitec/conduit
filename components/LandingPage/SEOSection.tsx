"use client"
import { Search, Map, Rss, Share2 } from "lucide-react"

export default function SEOSection() {
  return (
    <section id="seo" className="w-full px-4 py-24 max-w-6xl mx-auto scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
           <SEOCard icon={<Search />} label="Google Tags" />
           <SEOCard icon={<Map />} label="Auto Sitemaps" />
           <SEOCard icon={<Rss />} label="RSS Feed" />
           <SEOCard icon={<Share2 />} label="Social OG" />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Built-in SEO. <br /><span className="text-primary">Zero Effort.</span></h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Every article you publish is automatically optimized for search engines. 
            We generate the sitemaps, robots.txt, and metadata so you don't have to.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3 items-center font-medium">
               <div className="w-2 h-2 rounded-full bg-primary" />
               JSON-LD Structured Data for Rich Results
            </li>
            <li className="flex gap-3 items-center font-medium">
               <div className="w-2 h-2 rounded-full bg-primary" />
               Canonical URL Management
            </li>
            <li className="flex gap-3 items-center font-medium">
               <div className="w-2 h-2 rounded-full bg-primary" />
               Twitter & Open Graph Social Cards
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function SEOCard({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="bg-card border p-8 rounded-2xl flex flex-col items-center justify-center aspect-square text-center group hover:border-primary transition-colors">
       <div className="text-primary mb-4 transition-transform group-hover:scale-110">{icon}</div>
       <span className="font-bold text-sm uppercase tracking-tighter">{label}</span>
    </div>
  )
}
