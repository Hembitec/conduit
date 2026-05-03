import type { Node as PMNode } from "@tiptap/pm/model"
import type { Transaction } from "@tiptap/pm/state"
import {
  AllSelection,
  NodeSelection,
  Selection,
  TextSelection,
} from "@tiptap/pm/state"
import { cellAround, CellSelection } from "@tiptap/pm/tables"
import {
  findParentNodeClosestToPos,
  type Editor,
  type NodeWithPos,
} from "@tiptap/react"

// Extensions
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import Placeholder from "@tiptap/extension-placeholder"
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const MAC_SYMBOLS: Record<string, string> = {
  mod: "⌘",
  command: "⌘",
  meta: "⌘",
  ctrl: "⌃",
  control: "⌃",
  alt: "⌥",
  option: "⌥",
  shift: "⇧",
  backspace: "Del",
  delete: "⌦",
  enter: "⏎",
  escape: "⎋",
  capslock: "⇪",
} as const

export const SR_ONLY = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
} as const

export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ")
}

/**
 * Determines if the current platform is macOS
 */
export function isMac(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator.platform.toLowerCase().includes("mac")
  )
}

/**
 * Formats a shortcut key based on the platform
 */
export const formatShortcutKey = (
  key: string,
  isMac: boolean,
  capitalize: boolean = true
) => {
  if (isMac) {
    const lowerKey = key.toLowerCase()
    return MAC_SYMBOLS[lowerKey] || (capitalize ? key.toUpperCase() : key)
  }

  return capitalize ? key.charAt(0).toUpperCase() + key.slice(1) : key
}

/**
 * Parses a shortcut key string into an array of formatted key symbols
 */
export const parseShortcutKeys = (props: {
  shortcutKeys: string | undefined
  delimiter?: string
  capitalize?: boolean
}) => {
  const { shortcutKeys, delimiter = "+", capitalize = true } = props

  if (!shortcutKeys) return []

  return shortcutKeys
    .split(delimiter)
    .map((key) => key.trim())
    .map((key) => formatShortcutKey(key, isMac(), capitalize))
}

/**
 * Checks if a mark exists in the editor schema
 */
export const isMarkInSchema = (
  markName: string,
  editor: Editor | null
): boolean => {
  if (!editor?.schema) return false
  return editor.schema.spec.marks.get(markName) !== undefined
}

/**
 * Checks if a node exists in the editor schema
 */
export const isNodeInSchema = (
  nodeName: string,
  editor: Editor | null
): boolean => {
  if (!editor?.schema) return false
  return editor.schema.spec.nodes.get(nodeName) !== undefined
}

/**
 * Moves the focus to the next node in the editor
 */
export function focusNextNode(editor: Editor) {
  const { state, view } = editor
  const { doc, selection } = state

  const nextSel = Selection.findFrom(selection.$to, 1, true)
  if (nextSel) {
    view.dispatch(state.tr.setSelection(nextSel).scrollIntoView())
    return true
  }

  const paragraphType = state.schema.nodes.paragraph
  if (!paragraphType) {
    console.warn("No paragraph node type found in schema.")
    return false
  }

  const end = doc.content.size
  const para = paragraphType.create()
  let tr = state.tr.insert(end, para)

  // Place the selection inside the new paragraph
  const $inside = tr.doc.resolve(end + 1)
  tr = tr.setSelection(TextSelection.near($inside)).scrollIntoView()
  view.dispatch(tr)
  return true
}

/**
 * Checks if a value is a valid number
 */
export function isValidPosition(pos: number | null | undefined): pos is number {
  return typeof pos === "number" && pos >= 0
}

/**
 * Checks if one or more extensions are registered in the Tiptap editor.
 */
export function isExtensionAvailable(
  editor: Editor | null,
  extensionNames: string | string[]
): boolean {
  if (!editor) return false

  const names = Array.isArray(extensionNames)
    ? extensionNames
    : [extensionNames]

  const found = names.some((name) =>
    editor.extensionManager.extensions.some((ext) => ext.name === name)
  )

  return found
}

/**
 * Finds a node at the specified position
 */
export function findNodeAtPosition(editor: Editor, position: number) {
  try {
    const node = editor.state.doc.nodeAt(position)
    if (!node) return null
    return node
  } catch (error) {
    console.error(`Error getting node at position ${position}:`, error)
    return null
  }
}

/**
 * Finds the position and instance of a node in the document
 */
export function findNodePosition(props: {
  editor: Editor | null
  node?: PMNode | null
  nodePos?: number | null
}): { pos: number; node: PMNode } | null {
  const { editor, node, nodePos } = props

  if (!editor || !editor.state?.doc) return null

  const hasValidNode = node !== undefined && node !== null
  const hasValidPos = isValidPosition(nodePos)

  if (!hasValidNode && !hasValidPos) return null

  if (hasValidNode) {
    let foundPos = -1
    let foundNode: PMNode | null = null

    editor.state.doc.descendants((currentNode, pos) => {
      if (currentNode === node) {
        foundPos = pos
        foundNode = currentNode
        return false
      }
      return true
    })

    if (foundPos !== -1 && foundNode !== null) {
      return { pos: foundPos, node: foundNode }
    }
  }

  if (hasValidPos) {
    const nodeAtPos = findNodeAtPosition(editor, nodePos!)
    if (nodeAtPos) {
      return { pos: nodePos!, node: nodeAtPos }
    }
  }

  return null
}

/**
 * Determines whether the current selection contains a specific node type
 */
export function isNodeTypeSelected(
  editor: Editor | null,
  nodeTypeNames: string[] = [],
  checkAncestorNodes: boolean = false
): boolean {
  if (!editor || !editor.state.selection) return false

  const { selection } = editor.state
  if (selection.empty) return false

  if (selection instanceof NodeSelection) {
    const selectedNode = selection.node
    return selectedNode ? nodeTypeNames.includes(selectedNode.type.name) : false
  }

  if (checkAncestorNodes) {
    const { $from } = selection
    for (let depth = $from.depth; depth > 0; depth--) {
      const ancestorNode = $from.node(depth)
      if (nodeTypeNames.includes(ancestorNode.type.name)) {
        return true
      }
    }
  }

  return false
}

/**
 * Check whether the current selection is fully within nodes of specific types
 */
export function selectionWithinConvertibleTypes(
  editor: Editor,
  types: string[] = []
): boolean {
  if (!editor || types.length === 0) return false

  const { state } = editor
  const { selection } = state
  const allowed = new Set(types)

  if (selection instanceof NodeSelection) {
    const nodeType = selection.node?.type?.name
    return !!nodeType && allowed.has(nodeType)
  }

  if (selection instanceof TextSelection || selection instanceof AllSelection) {
    let valid = true
    state.doc.nodesBetween(selection.from, selection.to, (node) => {
      if (node.isTextblock && !allowed.has(node.type.name)) {
        valid = false
        return false
      }
      return valid
    })
    return valid
  }

  return false
}

/**
 * Universal image upload handler using Conduit R2 API.
 */
export const handleImageUpload = async (
  file: File,
  _onProgress?: (event: { progress: number }) => void,
): Promise<string> => {
  if (!file) throw new Error("No file provided")

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) throw new Error(`File size exceeds maximum allowed (5MB)`)

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    })

    if (!response.ok) throw new Error("Failed to get upload URL")

    const { presignedUrl, publicUrl } = await response.json()

    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      mode: "cors",
      headers: { "Content-Type": file.type },
    })

    if (!uploadResponse.ok) throw new Error(`Upload failed with status ${uploadResponse.status}`)

    return publicUrl
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed"
    throw new Error(message)
  }
}

/**
 * Common TipTap extensions for both Document and Article editors.
 */
export const getTiptapExtensions = (placeholder = "Start writing...", uploadHandler?: any) => [
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
    placeholder,
  }),
  ...(uploadHandler ? [
    ImageUploadNode.configure({
      accept: "image/*",
      maxSize: 5 * 1024 * 1024,
      limit: 3,
      upload: uploadHandler,
    }),
  ] : []),
]

export function sanitizeUrl(
  inputUrl: string,
  baseUrl: string
): string {
  try {
    const url = new URL(inputUrl, baseUrl)
    return url.href
  } catch {
    return "#"
  }
}

/**
 * Update a single attribute on multiple nodes.
 */
export function updateNodesAttr<A extends string = string, V = unknown>(
  tr: Transaction,
  targets: readonly NodeWithPos[],
  attrName: A,
  next: V | ((prev: V | undefined) => V | undefined)
): boolean {
  if (!targets.length) return false

  let changed = false

  for (const { pos } of targets) {
    const currentNode = tr.doc.nodeAt(pos)
    if (!currentNode) continue

    const prevValue = (currentNode.attrs as Record<string, unknown>)[
      attrName
    ] as V | undefined
    const resolvedNext =
      typeof next === "function"
        ? (next as (p: V | undefined) => V | undefined)(prevValue)
        : next

    if (prevValue === resolvedNext) continue

    const nextAttrs: Record<string, unknown> = { ...currentNode.attrs }
    if (resolvedNext === undefined) {
      delete nextAttrs[attrName]
    } else {
      nextAttrs[attrName] = resolvedNext
    }

    tr.setNodeMarkup(pos, undefined, nextAttrs)
    changed = true
  }

  return changed
}

/**
 * Selects the entire content of the current block node
 */
export function selectCurrentBlockContent(editor: Editor) {
  const { selection, doc } = editor.state
  if (!selection.empty) return

  const $pos = selection.$from
  let blockNode = null
  let blockPos = -1

  for (let depth = $pos.depth; depth >= 0; depth--) {
    const node = $pos.node(depth)
    const pos = $pos.start(depth)

    if (node.isBlock && node.textContent.trim()) {
      blockNode = node
      blockPos = pos
      break
    }
  }

  if (blockNode && blockPos >= 0) {
    const from = blockPos
    const to = blockPos + blockNode.nodeSize - 2
    if (from < to) {
      const $from = doc.resolve(from)
      const $to = doc.resolve(to)
      const newSelection = TextSelection.between($from, $to, 1)
      if (newSelection && !selection.eq(newSelection)) {
        editor.view.dispatch(editor.state.tr.setSelection(newSelection))
      }
    }
  }
}

/**
 * Retrieves all nodes of specified types from the current selection.
 */
export function getSelectedNodesOfType(
  selection: Selection,
  allowedNodeTypes: string[]
): NodeWithPos[] {
  const results: NodeWithPos[] = []
  const allowed = new Set(allowedNodeTypes)

  if (selection instanceof CellSelection) {
    selection.forEachCell((node: PMNode, pos: number) => {
      if (allowed.has(node.type.name)) {
        results.push({ node, pos })
      }
    })
    return results
  }

  if (selection instanceof NodeSelection) {
    const { node, from: pos } = selection
    if (node && allowed.has(node.type.name)) {
      results.push({ node, pos })
    }
    return results
  }

  const { $anchor } = selection
  const cell = cellAround($anchor)

  if (cell) {
    const cellNode = selection.$anchor.doc.nodeAt(cell.pos)
    if (cellNode && allowed.has(cellNode.type.name)) {
      results.push({ node: cellNode, pos: cell.pos })
      return results
    }
  }

  const parentNode = findParentNodeClosestToPos($anchor, (node) =>
    allowed.has(node.type.name)
  )

  if (parentNode) {
    results.push({ node: parentNode.node, pos: parentNode.pos })
  }

  return results
}

/**
 * Clamps a value between min and max bounds
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

export function getSelectedBlockNodes(editor: Editor): PMNode[] {
  const { doc } = editor.state
  const { from, to } = editor.state.selection

  const blocks: PMNode[] = []
  const seen = new Set<number>()

  doc.nodesBetween(from, to, (node, pos) => {
    if (!node.isBlock) return
    if (!seen.has(pos)) {
      seen.add(pos)
      blocks.push(node)
    }
    return false
  })

  return blocks
}
