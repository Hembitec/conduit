"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { ConvexError } from "convex/values"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { TagIcon, Trash2, Plus, Loader2 } from "lucide-react"

export default function TagsPage() {
  const tags = useQuery(api.tags.getTags)
  const createTag = useMutation(api.tags.createTag)
  const deleteTag = useMutation(api.tags.deleteTag)
  
  const [newTagName, setNewTagName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagName.trim()) return

    const slug = newTagName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    if (!slug) {
      toast.error("Invalid tag name")
      return
    }

    setIsSubmitting(true)
    try {
      await createTag({ name: newTagName.trim(), slug })
      setNewTagName("")
      toast.success("Tag created successfully")
    } catch (err: unknown) {
      const message = err instanceof ConvexError ? (err.data as string) : "Failed to create tag"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: Id<"tags">) => {
    setDeletingId(id)
    try {
      await deleteTag({ id })
      toast.success("Tag deleted")
    } catch (err: unknown) {
      const message = err instanceof ConvexError ? (err.data as string) : "Failed to delete tag"
      toast.error(message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="w-full max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tags</h1>
        <p className="text-muted-foreground text-lg">Manage tags to organize your articles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Tag Form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">New Tag</CardTitle>
              <CardDescription>Create a new tag for your articles.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="e.g. Next.js"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting || !newTagName.trim()} className="w-full">
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Create Tag
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Tags List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-primary" />
                All Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tags === undefined ? (
                <div className="py-8 flex justify-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : tags.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No tags created yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags.map((tag) => (
                      <TableRow key={tag._id}>
                        <TableCell className="font-medium">{tag.name}</TableCell>
                        <TableCell className="text-muted-foreground">{tag.slug}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(tag._id)}
                            disabled={deletingId === tag._id}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            {deletingId === tag._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
