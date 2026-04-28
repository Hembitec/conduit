"use client";

import { useState } from "react";
import { Document } from "@/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Documents from "./Documents";
import { EmptyState } from "@/components/EmptyState";

export function DocumentList({ initialDocuments }: { initialDocuments: Document[] }) {
  const [search, setSearch] = useState("");

  const filteredDocs = initialDocuments.filter((doc) => 
    doc.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {initialDocuments.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search documents by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredDocs.map((doc) => (
            <Documents key={doc._id} document={doc} />
          ))}
        </div>
      ) : initialDocuments.length > 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No documents found matching "{search}"
        </div>
      ) : (
        <EmptyState
          title="Start your first document"
          description="Create a document to begin writing. Your drafts auto-save as you type."
          actionLabel="New Document"
          actionHref="/cms/documents"
        />
      )}
    </div>
  );
}
