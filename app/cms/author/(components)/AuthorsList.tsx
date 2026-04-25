"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Trash2, User, Plus } from "lucide-react"
import { Doc } from "@/convex/_generated/dataModel"
import { EditAuthorDialog } from "./EditAuthorDialog"
import { DeleteAuthorDialog } from "./DeleteAuthorDialog"

interface AuthorsListProps {
  onCreateNew: () => void
}

function AuthorCard({ author }: { author: Doc<"authors"> }) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative h-16 bg-gradient-to-r from-primary/10 to-primary/5" />
        <CardContent className="pt-0 pb-4">
          <div className="flex flex-col items-center -mt-10">
            <Avatar className="h-20 w-20 border-4 border-background">
              {author.profileImg ? (
                <AvatarImage src={author.profileImg} alt={author.name} />
              ) : null}
              <AvatarFallback className="text-lg">
                {author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold mt-3 text-center">{author.name}</h3>
            <div className="flex gap-2 mt-2">
              {author.instagram && (
                <a
                  href={`https://instagram.com/${author.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors text-xs"
                >
                  @{author.instagram}
                </a>
              )}
              {author.twitter && (
                <a
                  href={`https://twitter.com/${author.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors text-xs"
                >
                  @{author.twitter}
                </a>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center gap-2 pt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <DeleteAuthorDialog author={author} />
        </CardFooter>
      </Card>

      <EditAuthorDialog
        author={author}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}

function AuthorCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-16 bg-muted" />
      <CardContent className="pt-0 pb-4">
        <div className="flex flex-col items-center -mt-10">
          <Skeleton className="h-20 w-20 rounded-full border-4 border-background" />
          <Skeleton className="h-5 w-24 mt-3" />
          <Skeleton className="h-4 w-16 mt-2" />
        </div>
      </CardContent>
      <CardFooter className="justify-center gap-2 pt-0">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </CardFooter>
    </Card>
  )
}

export function AuthorsList({ onCreateNew }: AuthorsListProps) {
  const authors = useQuery(api.authors.getAllAuthors)

  if (authors === undefined) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <AuthorCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (authors.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">No authors yet</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Create your first author to assign to articles
            </p>
          </div>
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Author
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {authors.map((author) => (
        <AuthorCard key={author._id} author={author} />
      ))}
    </div>
  )
}
