"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Tag, Plus } from "lucide-react"
import { Doc } from "@/convex/_generated/dataModel"
import { EditCategoryDialog } from "./EditCategoryDialog"
import { DeleteCategoryDialog } from "./DeleteCategoryDialog"

interface CategoriesListProps {
  onCreateNew: () => void
}

function CategoryItem({ category }: { category: Doc<"categories"> }) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <Card className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="text-xs text-muted-foreground">
              Created {new Date(category._creationTime).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <DeleteCategoryDialog category={category} />
        </div>
      </Card>

      <EditCategoryDialog
        category={category}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}

function CategoryItemSkeleton() {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-32 mt-1" />
        </div>
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </Card>
  )
}

export function CategoriesList({ onCreateNew }: CategoriesListProps) {
  const categories = useQuery(api.categories.getAllCategories)

  if (categories === undefined) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <CategoryItemSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Tag className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">No categories yet</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Create your first category to organize articles
            </p>
          </div>
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Category
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <CategoryItem key={category._id} category={category} />
      ))}
    </div>
  )
}
