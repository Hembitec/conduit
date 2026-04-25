"use client"

import { useState, useRef, ReactNode } from "react"
import { createPortal } from "react-dom"

interface TooltipProps {
  children: ReactNode
  content: string
  side?: "top" | "bottom" | "left" | "right"
  delay?: number
}

export function Tooltip({ children, content, side = "top", delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        let x = rect.left + rect.width / 2
        let y = 0

        switch (side) {
          case "top":
            y = rect.top - 8
            break
          case "bottom":
            y = rect.bottom + 8
            break
          case "left":
            x = rect.left - 8
            y = rect.top + rect.height / 2
            break
          case "right":
            x = rect.right + 8
            y = rect.top + rect.height / 2
            break
        }

        setCoords({ x, y })
        setIsVisible(true)
      }
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-flex"
      >
        {children}
      </div>
      {isVisible && typeof document !== "undefined" && createPortal(
        <div
          className={`fixed z-50 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-200 ${sideClasses[side]}`}
          style={{
            left: coords.x,
            top: coords.y,
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
}