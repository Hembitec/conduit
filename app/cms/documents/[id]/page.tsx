"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { use } from "react"

// --- Tiptap ---
import { getTiptapExtensions, handleImageUpload } from "@/lib/tiptap-utils"
import { TiptapMenuBar } from "@/components/TiptapMenuBar"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"

// --- Components ---
import DeleteDocument from "../../(components)/DeleteDocument"
import { SubmitDocument } from "./(components)/SubmitDocument"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Styles ---
import "@/styles/tiptap-editor.scss"
import "./editor-override.scss"

export default function DocumentEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const data = useQuery(api.documents.getDocumentById, { id: id as Id<"documents"> })
  const [isSaving, setIsSaving] = useState(false)
  const [html, setHtml] = useState("")
  const saveDocument = useMutation(api.documents.storeDocument)

  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Auto-save function
  const saveToConvex = useCallback(async (content: string) => {
    if (!content) return
    setIsSaving(true)
    try {
      await saveDocument({ 
        id: id as Id<"documents">, 
        title: data?.title || "Untitled", 
        document: content 
      })
    } catch {
      // Auto-save failed silently — user sees the "Saved" indicator won't update
    } finally {
      setIsSaving(false)
    }
  }, [id, data?.title, saveDocument])

  // Debounced auto-save effect
  useEffect(() => {
    if (!html) return
    const timer = setTimeout(() => {
      saveToConvex(html)
    }, 5000) // Save after 5 seconds of inactivity
    return () => clearTimeout(timer)
  }, [html, saveToConvex])

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: getTiptapExtensions("Start writing your article...", handleImageUpload),
    content: "",
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML())
    },
  })

  // Track whether we've already loaded the initial content
  const contentLoadedRef = useRef(false)

  // Load document content from Convex (once, on initial load)
  useEffect(() => {
    if (editor && data?.document && !contentLoadedRef.current) {
      // Defer to microtask to avoid flushSync inside React's commit phase
      queueMicrotask(() => {
        editor.commands.setContent(data.document)
        contentLoadedRef.current = true
      })
    }
  }, [editor, data?.document])

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header with back button, title, save status, and submit */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <a href="/cms/documents">
            <Button variant="ghost" className="gap-2">
              <ArrowLeftIcon className="tiptap-button-icon" />
              Back
            </Button>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isSaving ? (
              <>
                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Saved</span>
              </>
            )}
          </div>
          <SubmitDocument html={html} id={id} title={data?.title || ""} />
        </div>
      </div>

      {/* Document Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {data?.title}
        </h1>
      </div>

      {/* Editor */}
      <EditorContext.Provider value={{ editor }}>
        <div className="simple-editor-wrapper flex-1 flex flex-col overflow-hidden">
          <TiptapMenuBar 
            editor={editor} 
            toolbarRef={toolbarRef} 
            isMobile={isMobile} 
            height={height} 
            rect={rect} 
          />

          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content flex-1 overflow-y-auto"
          />
        </div>
      </EditorContext.Provider>
    </div>
  )
}
