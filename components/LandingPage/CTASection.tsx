"use client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { motion } from "framer-motion"

export default function CTASection() {
  return (
    <section className="w-full px-4 py-24 bg-card border-y">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Ready to reclaim your <br />
            <span className="text-primary text-glow">writing focus?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Join hundreds of writers who use Conduit to power their personal blogs, 
            documentation sites, and digital gardens.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/sign-up">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full font-bold shadow-xl shadow-primary/20">
              Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/cms">
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full font-bold">
              Explore Dashboard
            </Button>
          </Link>
        </motion.div>

        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium opacity-50">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
