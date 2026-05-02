# Conduit Landing Page Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the existing landing page into a comprehensive, high-fidelity 10-section showcase.

**Architecture:** Component-based expansion using a centralized `PageWrapper`. We will create modular sections in `components/LandingPage/` and compose them in `app/page.tsx`.

**Tech Stack:** Next.js 16.2, React 19, Tailwind CSS 4, Framer Motion (animations), MagicUI (visual effects).

---

### Task 1: Refined Hero Section

**Files:**
- Modify: `components/LandingPage/HeroSection.tsx`

- [ ] **Step 1: Update Hero Typography and Copy**
Update the hero to use a more impactful "Hero" style with the "Write. Publish. Grow." messaging and refined subtext.

```tsx
// components/LandingPage/HeroSection.tsx
// ... imports
export default function HeroSection() {
  return (
    <div className='flex flex-col items-center justify-center w-full overflow-x-hidden'>
      <section className='flex flex-col items-center justify-center px-4 pt-24 pb-12 w-full max-w-6xl'>
        <div className="mb-6">
          <AnimatedGradientTextComponent />
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-center max-w-5xl px-4 leading-[0.9]">
          Write once.<br />
          <span className="text-primary">Publish everywhere.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground text-center mt-8 px-4 leading-relaxed">
          The high-performance content engine for modern writers. 
          Manage your blog with a clean CMS and power any frontend via our lightning-fast API.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link href="/sign-up">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full gap-2">
              Get Started Free <ArrowRight className='w-5 h-5' />
            </Button>
          </Link>
          <Link href="/cms">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full gap-2">
              View Dashboard
            </Button>
          </Link>
        </div>
      </section>
      {/* ... rest of sections ... */}
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add components/LandingPage/HeroSection.tsx
git commit -m "feat: refine hero section typography and layout"
```

---

### Task 2: Portability & API Visual Section

**Files:**
- Create: `components/LandingPage/PortabilitySection.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create the PortabilitySection component**
Implement the animated "Visual Integration" graphic we designed in the brainstorming phase.

```tsx
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
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Fetch your content, authors, and metadata using our high-speed JSON API. 
            Build custom frontends, embed widgets, or power native apps without managing a database.
          </p>
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
```

- [ ] **Step 2: Add to app/page.tsx**
```tsx
import PageWrapper from "@/components/Container/PageWrapper";
import HeroSection from "@/components/LandingPage/HeroSection";
import PortabilitySection from "@/components/LandingPage/PortabilitySection";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <PortabilitySection />
    </PageWrapper>
  );
}
```

- [ ] **Step 3: Commit**
```bash
git add components/LandingPage/PortabilitySection.tsx app/page.tsx
git commit -m "feat: add animated portability and API section to landing page"
```

---

### Task 3: Focused Editor Showcase

**Files:**
- Create: `components/LandingPage/EditorSection.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create EditorSection component**
Focus on the TipTap integration, auto-save, and R2 images.

```tsx
"use client"
import { motion } from "framer-motion"
import { Save, Image as ImageIcon, FileText } from "lucide-react"

export default function EditorSection() {
  return (
    <section className="w-full px-4 py-24 max-w-6xl mx-auto">
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
```

- [ ] **Step 2: Add to app/page.tsx**
```tsx
import PageWrapper from "@/components/Container/PageWrapper";
import HeroSection from "@/components/LandingPage/HeroSection";
import PortabilitySection from "@/components/LandingPage/PortabilitySection";
import EditorSection from "@/components/LandingPage/EditorSection";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <EditorSection />
      <PortabilitySection />
    </PageWrapper>
  );
}
```

- [ ] **Step 3: Commit**
```bash
git add components/LandingPage/EditorSection.tsx app/page.tsx
git commit -m "feat: add editor deep-dive section to landing page"
```

---

### Task 4: SEO & Insight Engine Sections

**Files:**
- Create: `components/LandingPage/AnalyticsSection.tsx`
- Create: `components/LandingPage/SEOSection.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create AnalyticsSection component**
Showcase the Recharts/Insights part of the app.

```tsx
"use client"
import { BarChart3, TrendingUp, Users } from "lucide-react"

export default function AnalyticsSection() {
  return (
    <section className="w-full px-4 py-24 bg-muted/30">
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
```

- [ ] **Step 2: Create SEOSection component**
Focus on Sitemaps, RSS, and JSON-LD.

```tsx
"use client"
import { Search, Map, Rss, Share2 } from "lucide-react"

export default function SEOSection() {
  return (
    <section className="w-full px-4 py-24 max-w-6xl mx-auto">
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
```

- [ ] **Step 3: Add to app/page.tsx**
```tsx
import PageWrapper from "@/components/Container/PageWrapper";
import HeroSection from "@/components/LandingPage/HeroSection";
import PortabilitySection from "@/components/LandingPage/PortabilitySection";
import EditorSection from "@/components/LandingPage/EditorSection";
import AnalyticsSection from "@/components/LandingPage/AnalyticsSection";
import SEOSection from "@/components/LandingPage/SEOSection";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <EditorSection />
      <AnalyticsSection />
      <SEOSection />
      <PortabilitySection />
    </PageWrapper>
  );
}
```

- [ ] **Step 4: Commit**
```bash
git add components/LandingPage/AnalyticsSection.tsx components/LandingPage/SEOSection.tsx app/page.tsx
git commit -m "feat: add analytics and SEO sections to landing page"
```

---

### Task 5: Engagement & Technical Stack Sections

**Files:**
- Create: `components/LandingPage/EngagementSection.tsx`
- Create: `components/LandingPage/StackSection.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create EngagementSection component**

```tsx
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
```

- [ ] **Step 2: Create StackSection component**

```tsx
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
```

- [ ] **Step 3: Update app/page.tsx**
```tsx
import PageWrapper from "@/components/Container/PageWrapper";
import HeroSection from "@/components/LandingPage/HeroSection";
import PortabilitySection from "@/components/LandingPage/PortabilitySection";
import EditorSection from "@/components/LandingPage/EditorSection";
import AnalyticsSection from "@/components/LandingPage/AnalyticsSection";
import SEOSection from "@/components/LandingPage/SEOSection";
import EngagementSection from "@/components/LandingPage/EngagementSection";
import StackSection from "@/components/LandingPage/StackSection";
import Footer from "@/components/LandingPage/Footer";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <EditorSection />
      <AnalyticsSection />
      <SEOSection />
      <EngagementSection />
      <PortabilitySection />
      <StackSection />
      <Footer />
    </PageWrapper>
  );
}
```

- [ ] **Step 4: Commit**
```bash
git add components/LandingPage/EngagementSection.tsx components/LandingPage/StackSection.tsx app/page.tsx
git commit -m "feat: complete landing page sections"
```

---

### Task 6: Cleanup and Verification

- [ ] **Step 1: Verify layout and responsive**
Check for horizontal scroll and ensure all sections stack correctly on mobile.

- [ ] **Step 2: Final Build Check**
```bash
npm run build
```

- [ ] **Step 3: Remove Brainstorming Temporary Files**
```bash
rm -rf .superpowers/brainstorm/
```

- [ ] **Step 4: Commit Cleanup**
```bash
git commit -m "chore: cleanup and build verification"
```
