"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { BorderBeam } from "@/components/magicui/border-beam"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  children: React.ReactNode
  className?: string
}

function AuthCard({ children, className }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative w-full max-w-md", className)}
    >
      <Card className="relative overflow-hidden border bg-card/80 backdrop-blur-sm">
        <BorderBeam size={250} duration={12} delay={0} />
        <div className="relative z-10 p-8">{children}</div>
      </Card>
    </motion.div>
  )
}

export { AuthCard }
