"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Document, Author, Category } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { UploadButton } from "@/components/UploadButton"
import { ConvexError } from "convex/values"
import { useRouter } from "next/navigation"
import { 
  Type, 
  Image as ImageIcon, 
  User, 
  Tag, 
  Search, 
  FileText,
  Sparkles,
  Loader2
} from "lucide-react"

const FormSchema = z.object({
  title: z
    .string()
    .min(1, "Please enter an article title")
    .min(5, "Title should be at least 5 characters")
    .max(100, "Title should be less than 100 characters"),
  subtitle: z
    .string()
    .max(200, "Subtitle should be less than 200 characters")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  keywords: z.string().optional(),
  meta_description: z
    .string()
    .max(160, "Meta description should be less than 160 characters")
    .optional(),
  image_alt: z.string().optional(),
  author: z.string().min(1, "Please select an author"),
  category: z.string().min(1, "Please select a category"),
  article: z.string().min(1, "Please select a document to publish"),
})

type PublishFormData = z.infer<typeof FormSchema>

export default function Publish() {
  const router = useRouter()
  const [imageUploadUrl, setImageUploadUrl] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PublishFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      slug: "",
      keywords: "",
      meta_description: "",
      image_alt: "",
      author: "",
      category: "",
      article: "",
    },
  })

  const documentData = useQuery(api.documents.getAllDocuments)
  const authorsData = useQuery(api.authors.getAllAuthors)
  const categoryData = useQuery(api.categories.getAllCategories)

  // Auto-generate slug from title
  const titleValue = form.watch("title")
  const slugValue = form.watch("slug")
  
  useEffect(() => {
    if (titleValue && !slugValue) {
      const slug = titleValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
      form.setValue("slug", slug, { shouldValidate: false })
    }
  }, [titleValue, slugValue, form])

  const actStoreArticles = useMutation(api.blogs.storeArticle)

  async function onSubmit(data: PublishFormData) {
    setIsSubmitting(true)
    const selectedDoc = documentData?.find((d: Document) => d._id === data.article)
    const blogHtml = selectedDoc?.document ?? ""
    
    try {
      await actStoreArticles({
        title: data.title,
        subtitle: data.subtitle || "",
        slug: data.slug,
        blogHtml,
        sourceDocumentId: data.article as Id<"documents">,
        authorId: data.author as Id<"authors">,
        categoryId: data.category as Id<"categories">,
        keywords: data.keywords
          ? data.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
          : [],
        imageAlt: data.image_alt,
        image: imageUploadUrl,
        metaDescription: data.meta_description,
      })
      
      toast.success("Article published successfully!")
      form.reset()
      setImageUploadUrl("")
      router.push("/cms")
    } catch (error: unknown) {
      const message =
        error instanceof ConvexError
          ? (error.data as string)
          : "Failed to publish article. Please try again."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Character count for meta description
  const metaDescLength = form.watch("meta_description")?.length || 0

  return (
    <main className="w-full max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Publish Article
        </h1>
        <p className="text-muted-foreground text-lg">
          Transform your document into a published article
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Content */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Type className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Content</h2>
            </div>
            <Separator className="mb-6" />
            
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter a compelling title..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The main title of your article (5-100 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subtitle */}
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief summary or hook for your article..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: A short description that appears below the title
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} />
                          {field.value && field.value !== slugValue && (
                            <button
                              type="button"
                              onClick={() => {
                                const newSlug = titleValue
                                  ?.toLowerCase()
                                  .trim()
                                  .replace(/[^a-z0-9\s-]/g, "")
                                  .replace(/\s+/g, "-")
                                  .replace(/-+/g, "-")
                                if (newSlug) form.setValue("slug", newSlug)
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-primary"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Auto-generated from title. This appears in the URL: /blog/your-slug
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Cover Image */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Cover Image</h2>
            </div>
            <Separator className="mb-6" />
            
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Upload Area */}
                <div className="space-y-3">
                  <Label>Cover Image</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 hover:border-primary/50 transition-colors">
                    <UploadButton
                      onUploadComplete={(url) => setImageUploadUrl(url)}
                      label="Upload cover image"
                    />
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      Recommended: 1200 x 630 pixels for optimal social sharing
                    </p>
                  </div>
                </div>

                {/* Image Preview */}
                {imageUploadUrl && (
                  <div className="relative rounded-lg overflow-hidden border">
                    <img
                      src={imageUploadUrl}
                      alt="Cover preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUploadUrl("")}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded hover:bg-destructive/90"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Alt Text */}
                <FormField
                  control={form.control}
                  name="image_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Alt Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Describe the image for accessibility..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describes the image for screen readers and SEO
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Attribution */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Attribution</h2>
            </div>
            <Separator className="mb-6" />
            
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Author */}
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an author" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {authorsData?.map((author: Author) => (
                              <SelectItem key={author._id} value={author._id}>
                                {author.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Who wrote this article?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryData?.map((category: Category) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How should this be organized?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 4: SEO */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">SEO</h2>
            </div>
            <Separator className="mb-6" />
            
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Keywords */}
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., technology, tutorial, web development"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords that help readers find your article
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Meta Description */}
                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief summary for search results..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between">
                        <FormDescription>
                          Appears in search engine results
                        </FormDescription>
                        <span className={cn(
                          "text-xs",
                          metaDescLength > 160 ? "text-destructive" : "text-muted-foreground"
                        )}>
                          {metaDescLength}/160
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Section 5: Source Document */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Source Document</h2>
            </div>
            <Separator className="mb-6" />
            
            <Card>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="article"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Document *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose from your drafts" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentData?.map((doc: Document) => (
                            <SelectItem key={doc._id} value={doc._id}>
                              {doc.title || "Untitled Document"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The document content will be published as your article
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Submit Actions */}
          <div className="sticky bottom-0 bg-background border-t pt-4 pb-4 flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/cms")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Publish Article
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  )
}

