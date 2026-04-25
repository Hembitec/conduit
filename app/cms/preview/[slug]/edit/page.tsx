"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import Placeholder from "@tiptap/extension-placeholder"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"
import { LinkPopover } from "@/components/tiptap-ui/link-popover"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"

// --- Components ---
import { UpdateArticle } from "../../(components)/UpdateArticle"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"
import "./editor-override.scss"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

export default function ArticleEditor() {
  const params = useParams()
  const slug = params?.slug as string
  const data = useQuery(api.blogs.getArticleBySlug, { slug })

  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useState("")
  const [isSaving, setIsSaving] = useState(false)

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
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer nofollow' },
          openOnClick: false,
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: true }),
      Typography,
      Superscript,
      Subscript,
      Placeholder.configure({
        placeholder: "Start editing your article...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML())
    },
  })

  // Track whether we've already loaded the initial content
  const contentLoadedRef = useRef(false)

  // Load article content from Convex (once, on initial load)
  useEffect(() => {
    if (editor && data?.blogHtml && !contentLoadedRef.current) {
      // Defer to microtask to avoid flushSync inside React's commit phase
      queueMicrotask(() => {
        editor.commands.setContent(data.blogHtml)
        contentLoadedRef.current = true
      })
    }
  }, [editor, data?.blogHtml])

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header with back button and save status */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <a href={`/cms/preview/${slug}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeftIcon className="tiptap-button-icon" />
              Back to Preview
            </Button>
          </a>
        </div>
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
      </div>

      {/* Article Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {data?.title}
        </h1>
        <p className="text-muted-foreground mt-2">
          Editing article content
        </p>
      </div>

      {/* Editor */}
      <EditorContext.Provider value={{ editor }}>
        <div className="simple-editor-wrapper flex-1 flex flex-col border rounded-lg overflow-hidden">
          <Toolbar
            ref={toolbarRef}
            style={{
              ...(isMobile
                ? {
                    bottom: `calc(100% - ${height - rect.y}px)`,
                  }
                : {}),
            }}
          >
            <ToolbarGroup>
              <UndoRedoButton action="undo" />
              <UndoRedoButton action="redo" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <HeadingDropdownMenu modal={false} levels={[1, 2, 3]} />
              <ListDropdownMenu
                modal={false}
                types={["bulletList", "orderedList", "taskList"]}
              />
              <BlockquoteButton />
              <CodeBlockButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <MarkButton type="bold" />
              <MarkButton type="italic" />
              <MarkButton type="strike" />
              <MarkButton type="code" />
              <MarkButton type="underline" />
              <LinkPopover />
              <ColorHighlightPopover />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <MarkButton type="superscript" />
              <MarkButton type="subscript" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <TextAlignButton align="left" />
              <TextAlignButton align="center" />
              <TextAlignButton align="right" />
              <TextAlignButton align="justify" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <ImageUploadButton text="Add" />
            </ToolbarGroup>

            <Spacer />
          </Toolbar>

          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content flex-1 overflow-y-auto"
          />
        </div>
      </EditorContext.Provider>

      {/* Update Section */}
      <div className="mt-4">
        <UpdateArticle slug={slug} html={html} />
      </div>
    </div>
  )
}
