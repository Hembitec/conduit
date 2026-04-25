"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { ConvexError } from "convex/values"
import { Doc } from "@/convex/_generated/dataModel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, User, ImageIcon, Share2 } from "lucide-react"
import { UploadButton } from "@/components/UploadButton"

interface EditAuthorDialogProps {
  author: Doc<"authors">
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditAuthorDialog({ author, open, onOpenChange, onSuccess }: EditAuthorDialogProps) {
  const [name, setName] = useState(author.name)
  const [instagram, setInstagram] = useState(author.instagram ?? "")
  const [twitter, setTwitter] = useState(author.twitter ?? "")
  const [profileImg, setProfileImg] = useState(author.profileImg ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateAuthor = useMutation(api.authors.updateAuthor)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Name is required")
      return
    }

    setIsSubmitting(true)
    try {
      await updateAuthor({
        id: author._id,
        name: name.trim(),
        instagram: instagram.trim() || undefined,
        twitter: twitter.trim() || undefined,
        profileImg: profileImg.trim() || undefined,
      })
      toast.success("Author updated successfully")
      onOpenChange(false)
      onSuccess?.()
    } catch (error: unknown) {
      const message =
        error instanceof ConvexError
          ? (error.data as string)
          : "Failed to update author"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Edit Author
          </DialogTitle>
          <DialogDescription>
            Update author information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Author name"
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Profile Image
              </Label>
              {!profileImg ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-primary/50 transition-colors">
                  <UploadButton
                    onUploadComplete={(url) => setProfileImg(url)}
                    label="Upload profile image"
                  />
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="relative rounded-lg overflow-hidden border w-20 h-20">
                    <img
                      src={profileImg}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setProfileImg("")}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Social Links
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram" className="text-sm text-muted-foreground">
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="username"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter" className="text-sm text-muted-foreground">
                    Twitter / X
                  </Label>
                  <Input
                    id="twitter"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="username"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
