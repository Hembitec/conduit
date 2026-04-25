"use client"

import { useEffect, useState } from "react"
import { useOnboarding } from "./OnboardingContext"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  PenLine, 
  Share2, 
  BarChart3, 
  Settings, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Type,
  Image,
  Tag,
  Link,
  Users2,
  LineChart,
  Edit3,
  Compass,
  Sliders,
  ArrowRight,
  X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { BorderBeam } from "@/components/magicui/border-beam"

// Animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

interface Feature {
  icon: React.ReactNode
  label: string
  description: string
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  features: Feature[]
  icon: React.ElementType
  accentColor: string
}

const steps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Conduit",
    description: "Your minimal blog platform for focused writing. Let's take a quick tour to get you started.",
    features: [
      { icon: <Edit3 className="w-4 h-4" />, label: "Clean editor", description: "Distraction-free writing" },
      { icon: <Zap className="w-4 h-4" />, label: "Fast publishing", description: "One-click publish" },
      { icon: <Sparkles className="w-4 h-4" />, label: "Beautiful results", description: "Stunning output" },
    ],
    icon: Sparkles,
    accentColor: "from-yellow-500/20 to-amber-500/20",
  },
  {
    id: "documents",
    title: "Write in the Editor",
    description: "Create documents with our rich text editor. Format with bold, headings, lists, and more.",
    features: [
      { icon: <Type className="w-4 h-4" />, label: "Rich formatting", description: "Bold, italic, headings" },
      { icon: <CheckCircle2 className="w-4 h-4" />, label: "Auto-save", description: "Never lose work" },
      { icon: <Image className="w-4 h-4" />, label: "Image uploads", description: "Drag & drop images" },
    ],
    icon: FileText,
    accentColor: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "publish",
    title: "Publish Articles",
    description: "Transform documents into published articles with cover images, categories, and authors.",
    features: [
      { icon: <Tag className="w-4 h-4" />, label: "SEO metadata", description: "Optimized for search" },
      { icon: <Link className="w-4 h-4" />, label: "Custom slugs", description: "Pretty URLs" },
      { icon: <Users2 className="w-4 h-4" />, label: "Authors", description: "Multi-author support" },
    ],
    icon: PenLine,
    accentColor: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "share",
    title: "Share Your Work",
    description: "Make articles public and share them anywhere. Perfect for blogs, newsletters, or social media.",
    features: [
      { icon: <Link className="w-4 h-4" />, label: "Public links", description: "Shareable URLs" },
      { icon: <Share2 className="w-4 h-4" />, label: "Social sharing", description: "Built-in sharing" },
      { icon: <Settings className="w-4 h-4" />, label: "API access", description: "Programmatic access" },
    ],
    icon: Share2,
    accentColor: "from-purple-500/20 to-violet-500/20",
  },
  {
    id: "analytics",
    title: "Track Performance",
    description: "Monitor views, engagement, and reader behavior to understand what resonates with your audience.",
    features: [
      { icon: <LineChart className="w-4 h-4" />, label: "View analytics", description: "Track visitors" },
      { icon: <BarChart3 className="w-4 h-4" />, label: "Reading time", description: "Engagement metrics" },
      { icon: <Compass className="w-4 h-4" />, label: "Insights", description: "Data-driven decisions" },
    ],
    icon: BarChart3,
    accentColor: "from-orange-500/20 to-red-500/20",
  },
  {
    id: "start",
    title: "You're All Set!",
    description: "Start creating your first document. The editor is ready and waiting for your words.",
    features: [
      { icon: <Edit3 className="w-4 h-4" />, label: "Create first doc", description: "Start writing now" },
      { icon: <Compass className="w-4 h-4" />, label: "Explore dashboard", description: "Discover features" },
      { icon: <Sliders className="w-4 h-4" />, label: "Customize", description: "Personalize settings" },
    ],
    icon: Zap,
    accentColor: "from-primary/20 to-accent/20",
  },
]

function SegmentedProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-1">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          
          return (
            <div key={step.id} className="flex-1 group">
              <motion.div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isCompleted 
                    ? "bg-primary" 
                    : isCurrent 
                      ? "bg-gradient-to-r from-primary to-accent" 
                      : "bg-muted"
                }`}
                initial={false}
                animate={{ 
                  scaleY: isCurrent ? 1.2 : 1,
                  opacity: isCurrent ? 1 : isCompleted ? 0.7 : 0.4
                }}
              />
              <p className={`text-[10px] mt-1.5 text-center transition-colors ${
                isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
              }`}>
                {step.id === "start" ? "Done" : step.id}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.div
      variants={staggerItem}
      className="group relative overflow-hidden rounded-xl border bg-card/50 p-4 hover:bg-card hover:shadow-md transition-all duration-300 cursor-default"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex flex-col items-center text-center gap-2">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
          {feature.icon}
        </div>
        <div>
          <p className="text-sm font-semibold">{feature.label}</p>
          <p className="text-xs text-muted-foreground">{feature.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

function StepContent({ step, direction }: { step: OnboardingStep; direction: number }) {
  const Icon = step.icon
  
  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Visual Zone */}
        <motion.div 
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${step.accentColor} rounded-3xl blur-3xl opacity-30`} />
          <div className="relative">
            <motion.div 
              className="h-32 w-32 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="w-16 h-16" />
            </motion.div>
            {/* Floating elements */}
            <motion.div
              className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-accent/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-primary/20"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Right: Content Zone */}
        <div className="space-y-6">
          {/* Header */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step {steps.findIndex(s => s.id === step.id) + 1} of {steps.length}
            </span>
            <h2 className="text-3xl font-bold tracking-tight">{step.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-3 gap-3"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {step.features.map((feature, index) => (
              <FeatureCard key={feature.label} feature={feature} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function GlassNavigation({ 
  currentStep, 
  totalSteps, 
  onBack, 
  onNext, 
  onSkip,
  onComplete,
  direction 
}: { 
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  onSkip: () => void
  onComplete: () => void
  direction: number
}) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-6 px-6 py-4 rounded-2xl bg-card/80 backdrop-blur-xl border shadow-2xl">
        {/* Skip - subtle text link */}
        <button
          onClick={onSkip}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
        >
          Skip tour
        </button>

        <div className="h-6 w-px bg-border" />

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <motion.div
            initial={false}
            animate={{ 
              width: isFirstStep ? 0 : "auto",
              opacity: isFirstStep ? 0 : 1,
              marginRight: isFirstStep ? 0 : 8
            }}
            className="overflow-hidden"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="gap-1.5 h-9"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </motion.div>

          <Button
            size="sm"
            onClick={() => isLastStep ? onComplete() : onNext()}
            className="gap-1.5 h-9 min-w-[100px] relative overflow-hidden group"
          >
            <span className="relative z-10">
              {isLastStep ? "Get Started" : "Continue"}
            </span>
            {isLastStep ? (
              <Zap className="h-4 w-4 relative z-10 group-hover:animate-pulse" />
            ) : (
              <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
            )}
            {isLastStep && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Keyboard hints */}
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <kbd className="px-1.5 py-0.5 bg-muted rounded">Enter</kbd>
          <span>to continue</span>
        </div>
      </div>
    </motion.div>
  )
}

export function OnboardingModal() {
  const { isOpen, currentStep, nextStep, prevStep, skipOnboarding, completeOnboarding } = useOnboarding()
  const [showConfetti, setShowConfetti] = useState(false)
  const [direction, setDirection] = useState(1)

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  // Enhanced confetti celebration
  useEffect(() => {
    if (isLastStep && isOpen && !showConfetti) {
      setShowConfetti(true)
      
      // Burst from left
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.2, y: 0.6 },
        colors: ["#4A6B5A", "#C67E5B", "#7BA89A", "#D8997B", "#F5F1E8"],
        disableForReducedMotion: true,
      })
      
      // Burst from right (delayed)
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { x: 0.8, y: 0.6 },
          colors: ["#4A6B5A", "#C67E5B", "#7BA89A", "#D8997B", "#F5F1E8"],
          disableForReducedMotion: true,
        })
      }, 150)
      
      // Center burst (delayed more)
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { x: 0.5, y: 0.5 },
          colors: ["#4A6B5A", "#C67E5B", "#7BA89A", "#D8997B", "#F5F1E8"],
          disableForReducedMotion: true,
          shapes: ["circle", "square"],
        })
      }, 300)
    }
  }, [isLastStep, isOpen, showConfetti])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault()
        setDirection(1)
        if (isLastStep) {
          completeOnboarding()
        } else {
          nextStep()
        }
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        if (!isFirstStep) {
          setDirection(-1)
          prevStep()
        }
      }
      if (e.key === "Escape") {
        skipOnboarding()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentStep, isLastStep, isFirstStep, nextStep, prevStep, skipOnboarding, completeOnboarding])

  const handleNext = () => {
    setDirection(1)
    nextStep()
  }

  const handleBack = () => {
    setDirection(-1)
    prevStep()
  }

  const handleComplete = () => {
    // Final celebration burst
    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.6 },
      colors: ["#4A6B5A", "#C67E5B", "#7BA89A", "#D8997B", "#F5F1E8"],
      disableForReducedMotion: true,
      shapes: ["circle", "square"],
    })
    completeOnboarding()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop with animated gradient */}
        <motion.div
          className="absolute inset-0 bg-background/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={skipOnboarding}
        />

        {/* Floating gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1], 
              x: [0, 50, 0],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1], 
              x: [0, -30, 0],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Main Content Area */}
        <div className="relative z-50 flex-1 flex flex-col items-center justify-center p-6">
          {/* Top: Progress */}
          <motion.div
            className="absolute top-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SegmentedProgress currentStep={currentStep} />
          </motion.div>

          {/* Center: Step Content */}
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait" custom={direction}>
              <StepContent 
                key={currentStep} 
                step={steps[currentStep]} 
                direction={direction}
              />
            </AnimatePresence>
          </div>

          {/* Bottom: Close button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={skipOnboarding}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Bottom: Glass Navigation */}
        <GlassNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onBack={handleBack}
          onNext={handleNext}
          onSkip={skipOnboarding}
          onComplete={handleComplete}
          direction={direction}
        />
      </motion.div>
    </AnimatePresence>
  )
}