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
    <div className='flex flex-col items-center justify-center w-full overflow-x-hidden relative'>
      {/* Subtle Background Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 flex items-center justify-center">
        <svg className="absolute w-[200%] md:w-[150%] lg:w-full h-auto min-h-screen text-border/80 opacity-100 dark:text-border/60" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <path d="M-200 500C100 400 400 200 720 200C1040 200 1300 400 1600 500" stroke="currentColor" strokeWidth="1" />
          <path d="M-200 550C150 450 450 250 720 250C990 250 1250 450 1600 550" stroke="currentColor" strokeWidth="1" />
          <path d="M-200 600C200 500 500 300 720 300C940 300 1200 500 1600 600" stroke="currentColor" strokeWidth="1" />
          <path d="M-200 800C100 700 400 400 720 400C1040 400 1300 700 1600 800" stroke="currentColor" strokeWidth="1" />
          <path d="M-200 850C150 750 450 450 720 450C990 450 1250 750 1600 850" stroke="currentColor" strokeWidth="1" />
          <path d="M1600 300C1300 200 1000 0 720 0C440 0 100 200 -200 300" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Hero Section */}
      <section className='flex flex-col items-center justify-center px-4 pt-36 pb-20 w-full max-w-6xl relative z-10'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <AnimatedGradientTextComponent />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-center max-w-5xl px-4 leading-[0.95]"
        >
          Write once.<br />
          <span className="text-primary">Publish everywhere.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-xl text-muted-foreground text-center mt-8 px-4 leading-relaxed"
        >
          The high-performance content engine for modern writers. 
          Manage your blog with a clean CMS and power any frontend via our lightning-fast API.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <Link href="/sign-up">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              Get Started Free <ArrowRight className='w-5 h-5' />
            </Button>
          </Link>
          <Link href="/cms">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full gap-2 border-border/60 hover:bg-muted/50">
              View Dashboard
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Dashboard Screenshot */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className='w-full px-4 py-8 max-w-6xl'
      >
        <div className="relative rounded-2xl overflow-hidden border shadow-2xl bg-card">
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
      </motion.section>
    </div>
  )
}
