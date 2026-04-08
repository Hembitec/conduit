"use client"
import { Button } from '@/components/ui/button';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TiptapImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ImageIcon } from 'lucide-react';
import { use, useCallback, useEffect } from 'react';
import { SubmitDocument } from './(components)/SubmitDocument';
import DeleteDocument from '../../(components)/DeleteDocument';

// ─── MenuBar ─────────────────────────────────────────────────────
const MenuBar = ({ editor }: { editor: ReturnType<typeof useEditor> }) => {
  const addImage = useCallback(() => {
    const url = window.prompt('Image URL')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }, [editor])

  if (!editor) return null

  const btn = (
    active: boolean,
    onClick: () => void,
    label: React.ReactNode,
    disabled = false
  ) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={active
        ? 'p-1 border rounded bg-foreground text-background cursor-pointer'
        : 'p-1 border rounded hover:bg-muted cursor-pointer disabled:opacity-40'}
    >
      {label}
    </button>
  )

  return (
    <div className='flex gap-2 flex-wrap border-b pb-3 mb-5'>
      {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <strong>B</strong>, !editor.can().chain().focus().toggleBold().run())}
      {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <em>I</em>, !editor.can().chain().focus().toggleItalic().run())}
      {btn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), <s>S</s>, !editor.can().chain().focus().toggleStrike().run())}
      {btn(editor.isActive('code'), () => editor.chain().focus().toggleCode().run(), 'Code', !editor.can().chain().focus().toggleCode().run())}
      {btn(editor.isActive('img'), addImage, <ImageIcon className="w-4 h-4" />)}
      <span className="border-r mx-1" />
      {btn(editor.isActive('paragraph'), () => editor.chain().focus().setParagraph().run(), 'P')}
      {btn(editor.isActive('heading', { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), 'H1')}
      {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2')}
      {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3')}
      <span className="border-r mx-1" />
      {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), '• List')}
      {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), '1. List')}
      {btn(editor.isActive('codeBlock'), () => editor.chain().focus().toggleCodeBlock().run(), 'Code Block')}
      {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), '"Quote"')}
      <span className="border-r mx-1" />
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()} className="p-1 border rounded hover:bg-muted cursor-pointer">Clear Marks</button>
      <button onClick={() => editor.chain().focus().clearNodes().run()} className="p-1 border rounded hover:bg-muted cursor-pointer">Clear Nodes</button>
      <span className="border-r mx-1" />
      {btn(false, () => editor.chain().focus().undo().run(), 'Undo', !editor.can().chain().focus().undo().run())}
      {btn(false, () => editor.chain().focus().redo().run(), 'Redo', !editor.can().chain().focus().redo().run())}
    </div>
  )
}

// ─── DocumentEditor ──────────────────────────────────────────────
export default function DocumentEditor({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 16: params is a Promise — must use React.use() to unwrap
  const { id } = use(params)

  const data = useQuery(api.queries.getDocumentById, { id: id as Id<"documents"> });

  const extensions = [
    StarterKit.configure({
      bulletList: { keepMarks: true, keepAttributes: false },
      orderedList: { keepMarks: true, keepAttributes: false },
    }),
    Link.configure({
      HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer nofollow' },
    }),
    TiptapImage.configure({ inline: true }),
  ]

  const editor = useEditor({ extensions, content: "" })

  useEffect(() => {
    if (editor && data?.document) {
      editor.commands.setContent(data.document)
    }
  }, [editor, data?.document]);

  const html = editor?.getHTML()

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  return (
    <div className='flex flex-col items-end w-full'>
      <div className='flex justify-center items-center gap-3'>
        <DeleteDocument id={id} />
        <a href="/cms/documents">
          <Button variant="outline">Back</Button>
        </a>
      </div>
      <div className="p-4 border rounded mt-5 w-full">
        <div className='flex pb-3 my-7'>
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
            {data?.title}
          </h1>
        </div>
        <MenuBar editor={editor} />
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'border rounded bg-foreground text-background border-foreground px-2 mx-1' : 'px-2 border rounded bg-background mx-1'}
            >bold</button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'border rounded bg-foreground text-background border-foreground px-2 mx-1' : 'px-2 border rounded bg-background mx-1'}
            >italic</button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive('strike') ? 'border rounded bg-foreground text-background border-foreground px-2 mx-1' : 'px-2 border rounded bg-background mx-1'}
            >strike</button>
            <button onClick={setLink} className={editor.isActive('link') ? 'border rounded bg-foreground text-background border-foreground px-2 mx-1' : 'px-2 mx-1 border rounded bg-background'}>link</button>
            <button
              className={editor.isActive('link') ? 'border rounded bg-blue-700 text-white px-2 mx-1' : 'px-2 mx-1 border rounded bg-background'}
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive('link')}
            >unlink</button>
          </BubbleMenu>
        )}
        <div className="tiptap-editor">
          <EditorContent editor={editor} />
        </div>
        <div className="mt-4 w-full">
          <SubmitDocument html={html ?? ""} id={id} title={data?.title || ""} />
        </div>
      </div>
    </div>
  )
}
