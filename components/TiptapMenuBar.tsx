"use client"

import React from "react"
import { Editor } from "@tiptap/react"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { LinkPopover } from "@/components/tiptap-ui/link-popover"
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"

interface TiptapMenuBarProps {
  editor: Editor | null
  toolbarRef?: React.RefObject<HTMLDivElement | null>
  isMobile?: boolean
  height?: number
  rect?: { y: number }
}

export const TiptapMenuBar = ({
  editor,
  toolbarRef,
  isMobile,
  height,
  rect,
}: TiptapMenuBarProps) => {
  if (!editor) return null

  return (
    <Toolbar
      ref={toolbarRef as React.RefObject<HTMLDivElement>}
      style={{
        ...(isMobile && height && rect
          ? {
              bottom: `calc(100% - ${height - rect.y}px)`,
            }
          : {}),
      }}
    >
      <ToolbarGroup>
        <UndoRedoButton editor={editor} action="undo" />
        <UndoRedoButton editor={editor} action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu editor={editor} modal={false} levels={[1, 2, 3]} />
        <ListDropdownMenu
          editor={editor}
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton editor={editor} />
        <CodeBlockButton editor={editor} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton editor={editor} type="bold" />
        <MarkButton editor={editor} type="italic" />
        <MarkButton editor={editor} type="strike" />
        <MarkButton editor={editor} type="code" />
        <MarkButton editor={editor} type="underline" />
        <LinkPopover editor={editor} />
        <ColorHighlightPopover editor={editor} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton editor={editor} type="superscript" />
        <MarkButton editor={editor} type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton editor={editor} align="left" />
        <TextAlignButton editor={editor} align="center" />
        <TextAlignButton editor={editor} align="right" />
        <TextAlignButton editor={editor} align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton editor={editor} text="Add" />
      </ToolbarGroup>

      <Spacer />
    </Toolbar>
  )
}
