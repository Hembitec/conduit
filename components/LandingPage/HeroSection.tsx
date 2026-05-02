"use client"
import { ArrowRight, PenLine, Search, BarChart3, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from 'framer-motion';
import { AnimatedGradientTextComponent } from './AnimatedGradientComponent';
import { BorderBeam } from '../magicui/border-beam';
import { Card, CardContent } from '../ui/card';

const features = [
  {
    icon: PenLine,
    title: "Rich Editor",
    description: "Write with TipTap, a powerful rich text editor. Format, link, and style with ease.",
  },
  {
    icon: Search,
    title: "SEO Ready",
    description: "Meta tags, sitemaps, and Open Graph built-in. Every article optimized for search.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track views, reading time, and engagement. Know what resonates with readers.",
  },
  {
    icon: Zap,
    title: "Fast API",
    description: "REST API for your content. Fetch blogs anywhere with simple endpoints.",
  },
];

export default function HeroSection() {
  return (
    <div className='flex flex-col items-center justify-center w-full overflow-x-hidden'>
      {/* Hero Section */}
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

      {/* Dashboard Screenshot */}
      <section className='w-full px-4 py-8 max-w-6xl'>
        <div className="relative rounded-xl overflow-hidden border shadow-lg">
          <Image
            src="/home.png"
            alt="Conduit CMS Dashboard"
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
            priority
          />
          <BorderBeam size={300} duration={15} delay={0} />
        </div>
      </section>

      {/* Features Section */}
      <section className='w-full px-4 py-16 bg-muted/30'>
        <div className='max-w-6xl mx-auto'>
          <div className="text-center mb-12">
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Built for writers who want to focus on their craft, not their tools.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='w-full px-4 py-16 max-w-6xl'>
        <div className='rounded-xl bg-primary/5 border p-8 md:p-12 text-center'>
          <h2 className="scroll-m-20 text-2xl md:text-3xl font-bold tracking-tight">
            Ready to start writing?
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Create your free account and publish your first article in minutes.
          </p>
          <div className="mt-6">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Get Started Free <ArrowRight className='w-4 h-4' />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
