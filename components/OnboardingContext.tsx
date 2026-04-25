"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface OnboardingContextType {
  hasSeenOnboarding: boolean
  isOpen: boolean
  currentStep: number
  startOnboarding: () => void
  nextStep: () => void
  prevStep: () => void
  skipOnboarding: () => void
  completeOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const seen = localStorage.getItem("conduit_onboarding_seen")
    if (!seen) {
      setHasSeenOnboarding(false)
      setIsOpen(true)
    }
  }, [])

  const startOnboarding = () => {
    setCurrentStep(0)
    setIsOpen(true)
  }

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  const skipOnboarding = () => {
    setIsOpen(false)
    localStorage.setItem("conduit_onboarding_seen", "true")
  }

  const completeOnboarding = () => {
    setIsOpen(false)
    localStorage.setItem("conduit_onboarding_seen", "true")
  }

  return (
    <OnboardingContext.Provider
      value={{
        hasSeenOnboarding,
        isOpen,
        currentStep,
        startOnboarding,
        nextStep,
        prevStep,
        skipOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}