"use client"

import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from "convex/react"
import { Clipboard, Edit, Share, Trash2, Globe, Lock, Check, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { api } from "@/convex/_generated/api"
import { toast } from 'sonner'
import { ConvexError } from "convex/values"

export default function ManageArticle({ params }: {
  params: { slug: string }
}) {
  const [copied, setCopied] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const router = useRouter()

  const actDeleteBlog = useMutation(api.blogs.deleteBlog)
  const actStatusBlog = useMutation(api.blogs.statusBlog)
  const actShareArticle = useMutation(api.blogs.shareArticle)
  const actSyncFromDocument = useMutation(api.blogs.syncFromDocument)

  const data = useQuery(api.blogs.getArticleBySlug, { slug: params?.slug })
  const isPending = data === undefined

  const { register, handleSubmit } = useForm<{ shareSetting: string }>()

  const onSubmit = async (submitData: { shareSetting: string }) => {
    const shareSetting = submitData.shareSetting === 'true'
    setIsUpdating(true)
    try {
      await actShareArticle({ slug: params?.slug, shareable: shareSetting })
      toast.success(shareSetting ? "Article is now public" : "Article is now private")
    } catch (error: unknown) {
      const message = error instanceof ConvexError ? (error.data as string) : "Failed to update shareability"
      toast.error(message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCopyUrl = () => {
    const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/blog/${data?.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("URL copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    try {
      await actDeleteBlog({ slug: params?.slug })
      toast.success("Article deleted")
      router.push("/cms")
    } catch (error: unknown) {
      const message = error instanceof ConvexError ? (error.data as string) : "Failed to delete article"
      toast.error(message)
    }
  }

  const handleTogglePublish = async () => {
    try {
      await actStatusBlog({ slug: params?.slug, published: !data?.published })
      toast.success(data?.published ? "Article unpublished" : "Article published")
    } catch (error: unknown) {
      const message = error instanceof ConvexError ? (error.data as string) : "Failed to update status"
      toast.error(message)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await actSyncFromDocument({ slug: params?.slug })
      toast.success("Article synced with latest document content")
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof ConvexError ? (error.data as string) : "Failed to sync from document"
      toast.error(message)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="flex flex-wrap justify-end items-center gap-2">
      {/* Share Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="gap-2">
            <Share className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </PopoverTrigger>
        {!isPending && (
          <PopoverContent className="w-80">
            <h4 className="font-medium">Share Settings</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Control who can view this article
            </p>
            <Separator className="w-full mt-3" />
            
            <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
              <RadioGroup 
                defaultValue={data?.shareable ? "true" : "false"} 
                {...register("shareSetting")} 
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-3 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="true" id="publicOption" />
                  <Label htmlFor="publicOption" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Globe className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Public</div>
                      <div className="text-xs text-muted-foreground">Anyone with the link can view</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="false" id="privateOption" />
                  <Label htmlFor="privateOption" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Private</div>
                      <div className="text-xs text-muted-foreground">Only you can view</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              <Button type="submit" size="sm" className="w-full mt-3" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </form>

            {data?.shareable && (
              <div className="mt-4 pt-3 border-t">
                <Label className="text-xs text-muted-foreground">Share Link</Label>
                <div className="flex gap-2 mt-2">
                  <Input 
                    value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/blog/${data?.slug}`}
                    readOnly
                    className="text-xs"
                  />
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={handleCopyUrl}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        )}
      </Popover>

      {/* Sync from Document */}
      {data?.sourceDocumentId && (
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync from Doc'}</span>
        </Button>
      )}

      {/* Edit Button */}
      <Link href={`/cms/preview/${params?.slug}/edit`}>
        <Button size="sm" variant="outline" className="gap-2">
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      </Link>

      {/* Delete Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="ghost" className="gap-2 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{data?.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish/Unpublish Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            size="sm" 
            variant={data?.published ? "outline" : "default"}
          >
            {data?.published ? "Unpublish" : "Publish"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {data?.published ? "Unpublish Article" : "Publish Article"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {data?.published 
                ? "This will remove the article from public view. You can republish it later."
                : "This will make the article publicly visible to anyone with the link."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTogglePublish}>
              {data?.published ? "Unpublish" : "Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
