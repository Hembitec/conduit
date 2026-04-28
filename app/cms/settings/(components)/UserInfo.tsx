"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, RefreshCw, Copy, Check, HelpCircle, Key, User, ExternalLink, Sun, Moon, Monitor } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import { useOnboarding } from '@/components/OnboardingContext'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

type ThemeOption = 'light' | 'dark' | 'system'

const themeOptions: { value: ThemeOption; label: string; icon: React.ElementType }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export default function UserInfo() {
  const { theme, setTheme } = useTheme()
  const [showAPI, setShowAPI] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const { startOnboarding } = useOnboarding()

  const user = useQuery(api.users.currentUser)
  const actGenerateApiKey = useMutation(api.users.generateApiKey)

  const apiKey = user?.apiKey ?? ""

  async function handleGenerate() {
    setGenerating(true)
    try {
      await actGenerateApiKey()
      toast.success("New API key generated")
    } catch (error: unknown) {
      const message = error instanceof ConvexError ? (error.data as string) : "Failed to generate key"
      toast.error(message)
    } finally {
      setGenerating(false)
    }
  }

  function handleCopy() {
    if (!apiKey) {
      toast.error("Generate an API key first")
      return
    }
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    toast.success("API key copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto w-full space-y-8 py-6">
      {/* Profile Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={user?.email ?? "Loading..."}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Your account email is managed by your authentication provider
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Appearance Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sun className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Appearance</h2>
        </div>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Theme</CardTitle>
            <CardDescription>
              Choose how Conduit CMS looks for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 text-sm font-medium transition-all cursor-pointer",
                    theme === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40 hover:bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* API Access Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">API Access</h2>
        </div>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">API Key</CardTitle>
            <CardDescription>
              Use this key in the <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">X-Auth-Key</code> header when calling the public API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!apiKey && (
              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  No API key yet. Generate one to access the public API.
                </p>
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                  {generating ? "Generating..." : "Generate API Key"}
                </Button>
              </div>
            )}

            {apiKey && (
              <>
                <div className="flex gap-2">
                  <Input
                    type={showAPI ? "text" : "password"}
                    value={apiKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowAPI(!showAPI)}
                    title={showAPI ? "Hide key" : "Show key"}
                  >
                    {showAPI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCopy}
                    title="Copy key"
                  >
                    {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                  Regenerate Key
                </Button>
              </>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                API endpoints: <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">/api/blog/all</code>, <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">/api/blog/[slug]</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Help Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Need Help?</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Take a guided tour to learn how to use all the features of Conduit CMS.
            </p>
            <Button
              variant="outline"
              className="gap-2"
              onClick={startOnboarding}
            >
              <ExternalLink className="h-4 w-4" />
              Start Welcome Tour
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
