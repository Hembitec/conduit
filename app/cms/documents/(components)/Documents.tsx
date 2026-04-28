"use client"

import { Document } from "@/types"
import { EntityCard } from "@/components/ui/entity-card"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"

interface DocumentsProps {
  document: Document
}

export default function Documents({ document }: DocumentsProps) {
  const deleteDoc = useMutation(api.documents.deleteDocument)

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc({ id: id as Id<"documents"> })
      toast.success("Document deleted")
    } catch (error) {
      toast.error("Failed to delete document")
    }
  }

  return (
    <EntityCard
      variant="document"
      data={document}
      onDelete={handleDelete}
    />
  )
}
