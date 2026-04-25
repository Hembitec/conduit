"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Plus, FileText } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const createDocumentSchema = z.object({
  name: z.string().min(1, "Document name is required").max(100, "Name must be less than 100 characters"),
})

type CreateDocumentForm = z.infer<typeof createDocumentSchema>

export default function CreateDocument() {
  const [open, setOpen] = useState<boolean>(false)
  const actCreateDocument = useMutation(api.documents.createDocument)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateDocumentForm>({
    resolver: zodResolver(createDocumentSchema),
  })

  const onSubmit = async (data: CreateDocumentForm) => {
    try {
      const id = await actCreateDocument({ title: data.name })
      setOpen(false)
      reset()
      router.push(`/cms/documents/${id}`)
      toast.success("Document created successfully")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create document"
      toast.error(message)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" />
          New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            New Document
          </DialogTitle>
          <DialogDescription>
            Give your document a name to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="document-name">
              Document Name
            </Label>
            <Input
              id="document-name"
              placeholder="e.g., Blog Post Ideas, Draft Article..."
              {...register("name")}
              aria-invalid={errors.name ? "true" : "false"}
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  Creating...
                </>
              ) : (
                "Create Document"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
