"use client"

import { Document } from "@/types"
import { EntityCard } from "@/components/ui/entity-card"

interface DocumentsProps {
  document: Document
}

export default function Documents({ document }: DocumentsProps) {
  return (
    <EntityCard
      variant="document"
      data={document}
      onDelete={(id) => {
        // Delete is handled inline in the component
      }}
    />
  )
}
