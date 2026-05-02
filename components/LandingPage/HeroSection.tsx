"use client"
import { ArrowRight, Search, BarChart3, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from 'framer-motion';
import { AnimatedGradientTextComponent } from './AnimatedGradientComponent';
import { BorderBeam } from '../magicui/border-beam';

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
    </div>
  )
}
