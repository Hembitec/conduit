import { fetchQuery } from "convex/nextjs"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@/convex/_generated/api"
import { Document } from "@/types"
import CreateDocument from "../(components)/CreateDocument"
import Documents from "./(components)/Documents"
import { EmptyState } from "@/components/EmptyState"

export default async function DocumentsPage() {
  const token = await convexAuthNextjsToken()
  const response = await fetchQuery(api.documents.getAllDocuments, {}, { token })
  const documents = (response || []) as Document[]

  return (
    <main className="flex w-full flex-col">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-bold tracking-tight text-3xl">
            My Documents
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Drafts, ideas, and articles in progress
          </p>
        </div>
        <CreateDocument />
      </div>

      {/* Documents Grid */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {documents.map((doc) => (
            <Documents key={doc._id} document={doc} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Start your first document"
          description="Create a document to begin writing. Your drafts auto-save as you type."
          actionLabel="New Document"
          actionHref="/cms/documents"
        />
      )}
    </main>
  )
}
