"use client"

import { useState, forwardRef } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean
  strength?: number
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength, strength = 0, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const getStrengthColor = (s: number) => {
      if (s === 0) return "bg-muted"
      if (s <= 2) return "bg-destructive"
      if (s <= 3) return "bg-yellow-500"
      return "bg-green-500"
    }

    const getStrengthLabel = (s: number) => {
      if (s === 0) return ""
      if (s <= 2) return "Weak"
      if (s <= 3) return "Fair"
      if (s <= 4) return "Good"
      return "Strong"
    }

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            ref={ref}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {showStrength && strength > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1 h-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-full transition-colors",
                    i <= strength ? getStrengthColor(strength) : "bg-muted"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Password strength: <span className={cn("font-medium", strength >= 4 ? "text-green-500" : strength >= 3 ? "text-yellow-500" : "text-destructive")}>{getStrengthLabel(strength)}</span>
            </p>
          </div>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
