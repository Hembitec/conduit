"use client"

import { FileText, Send, Link2 } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    icon: FileText,
    title: "Create",
    description: "Write in our distraction-free editor. Rich text formatting, auto-save, and image uploads.",
  },
  {
    icon: Send,
    title: "Publish",
    description: "Add a cover image, select categories, and configure SEO metadata. One click to publish.",
  },
  {
    icon: Link2,
    title: "Share",
    description: "Get a public link to share anywhere. Or use the REST API to fetch your content programmatically.",
  },
]

export default function HowItWorks() {
  return (
    <section className="w-full px-4 py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="scroll-m-20 text-3xl font-bold tracking-tight">
            How it works
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            From idea to published article in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-border" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative"
            >
              <Card className="bg-card border-0 shadow-none">
                <CardContent className="pt-6 text-center">
                  <div className="relative inline-flex">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
