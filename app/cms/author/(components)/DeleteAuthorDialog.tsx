"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ConvexError } from "convex/values"

interface DeleteAuthorDialogProps {
  author: Doc<"authors">
  onSuccess?: () => void
}

export function DeleteAuthorDialog({ author, onSuccess }: DeleteAuthorDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteAuthor = useMutation(api.authors.deleteAuthor)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteAuthor({ id: author._id })
      toast.success("Author deleted successfully")
      onSuccess?.()
    } catch (error: unknown) {
      const message =
        error instanceof ConvexError
          ? (error.data as string)
          : "Failed to delete author"
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Author</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{author.name}&quot;? This action cannot be undone.
            If this author is assigned to any articles, you will need to reassign them first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
