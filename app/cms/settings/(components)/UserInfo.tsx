"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, RefreshCw, Copy, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'

export default function UserInfo() {
  const [showAPI, setShowAPI] = useState<boolean>(false)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  const user = useQuery(api.queries.currentUser)
  const actGenerateApiKey = useMutation(api.mutations.generateApiKey)

  const apiKey = user?.apiKey ?? ""

  async function handleGenerate() {
    setGenerating(true)
    try {
      await actGenerateApiKey()
      toast("New API key generated")
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
    toast("API key copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 w-[90%] md:w-[60%] lg:w-[50%] mt-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 w-full text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        My Profile
      </h2>

      {/* Profile Info */}
      <div className="flex flex-col gap-3">
        <Label>Email</Label>
        <Input
          value={user?.email ?? "Loading..."}
          disabled
          className="bg-muted"
        />
      </div>

      {/* API Key */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>API Key</Label>
          {!apiKey && (
            <p className="text-xs text-muted-foreground">No key yet — click Generate to create one</p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            type={showAPI ? "text" : "password"}
            value={apiKey || ""}
            readOnly
            placeholder="No API key — click Generate"
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
            disabled={!apiKey}
            title="Copy key"
          >
            {copied ? <CheckCheck className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-fit gap-2"
          onClick={handleGenerate}
          disabled={generating}
        >
          <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
          {apiKey ? "Regenerate API Key" : "Generate API Key"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Use this key in the <span className="font-medium">X-Auth-Key</span> header when calling the public API.
        </p>
      </div>
    </div>
  )
}
