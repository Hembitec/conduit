"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

const navigation = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'API Docs', href: '/cms/api' },
  ],
  company: [
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ],
  legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
}

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const subscribe = useMutation(api.subscribers.subscribe)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setLoading(true)
    try {
      // For the landing page, we use a global/placeholder blog owner 
      // or simply record the interest. In this schema, it needs a blogUserId.
      // We'll use a placeholder or handle the error gracefully.
      await subscribe({ email, blogUserId: "landing_page" as any })
      toast.success("Thanks for subscribing!")
      setEmail("")
    } catch (err) {
      toast.error("Subscription failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="w-full border-t bg-card text-card-foreground">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-foreground">
              CONDUIT
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A professional-grade content engine for focused writers. Built with Next.js, Convex, and TipTap.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/michaelshimeles/cms"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://x.com/rasmickyy"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-[0.2em] text-primary">Product</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-[0.2em] text-primary">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-[0.2em] text-primary">Newsletter</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get the latest updates on blogging and CMS features.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com" 
                required
                className="bg-muted/50 border-muted-foreground/20 focus:border-primary"
              />
              <Button type="submit" disabled={loading} className="w-full font-bold">
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Conduit CMS. All rights reserved.
          </p>
          <div className="flex gap-6">
            {navigation.legal.map((item) => (
              <Link key={item.name} href={item.href} className="text-xs text-muted-foreground hover:text-primary">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
