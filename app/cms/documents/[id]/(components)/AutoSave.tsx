"use client"

import { useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface AutoSaveDocumentProps {
  html: string;
  id: string;
  title: string;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
}

export function useAutoSave({ html, id, title, isSaving, setIsSaving }: AutoSaveDocumentProps) {
  const actStoreDocument = useMutation(api.documents.storeDocument);

  const saveDocument = useCallback(async () => {
    if (!html || isSaving) return;
    
    setIsSaving(true);
    try {
      await actStoreDocument({ 
        id: id as Id<"documents">, 
        title: title || "Untitled", 
        document: html 
      });
      // Toast only on manual save, not auto-save
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save document"
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, [html, id, title, actStoreDocument, setIsSaving]);

  // Auto-save when html changes (debounced)
  useEffect(() => {
    if (!html) return;
    
    const timer = setTimeout(() => {
      saveDocument();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [html, saveDocument]);

  return { saveDocument };
}
