"use client"

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
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { z } from "zod"
import { UploadButton } from "@/components/UploadButton"
import { ConvexError } from "convex/values"
import { useRouter } from "next/navigation"
import { User, Image as ImageIcon, Loader2, X, Share2, ArrowLeft } from "lucide-react"
import { AuthorsList } from "./(components)/AuthorsList"

const FormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name should be at least 2 characters"),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
})

type AuthorFormData = z.infer<typeof FormSchema>

export default function Author() {
  const router = useRouter()
  const [imageUploadUrl, setImageUploadUrl] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const form = useForm<AuthorFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      instagram: "",
      twitter: "",
    },
  })

  const actCreateAuthor = useMutation(api.authors.createAuthor)

  async function onSubmit(data: AuthorFormData) {
    setIsSubmitting(true)
    try {
      await actCreateAuthor({
        name: data.name,
        instagram: data.instagram?.replace(/^@/, "") || undefined,
        twitter: data.twitter?.replace(/^@/, "") || undefined,
        profileImg: imageUploadUrl || undefined,
      })
      toast.success("Author created successfully!")
      form.reset()
      setImageUploadUrl("")
      setShowCreateForm(false)
    } catch (error: unknown) {
      const message =
        error instanceof ConvexError
          ? (error.data as string)
          : "Failed to create author"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!showCreateForm) {
    return (
      <main className="w-full max-w-6xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Authors
            </h1>
            <p className="text-muted-foreground">
              Manage author profiles for your articles
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="gap-2"
          >
            <User className="h-4 w-4" />
            New Author
          </Button>
        </div>

        <AuthorsList onCreateNew={() => setShowCreateForm(true)} />
      </main>
    )
  }

  return (
    <main className="w-full max-w-2xl mx-auto pb-20">
      <Button
        variant="ghost"
        onClick={() => setShowCreateForm(false)}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Authors
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Create Author
        </h1>
        <p className="text-muted-foreground text-lg">
          Add an author profile to assign to your articles
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Basic Information</h2>
            </div>
            <Separator className="mb-6" />

            <Card>
              <CardContent className="p-6 space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter author name..." {...field} />
                      </FormControl>
                      <FormDescription>
                        The author&apos;s full name as it will appear on articles
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Profile Image</h2>
            </div>
            <Separator className="mb-6" />

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <FormLabel>Profile Photo</FormLabel>
                  {!imageUploadUrl ? (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 hover:border-primary/50 transition-colors">
                      <UploadButton
                        onUploadComplete={(url) => setImageUploadUrl(url)}
                        label="Upload profile image"
                      />
                      <p className="text-sm text-muted-foreground text-center mt-4">
                        Recommended: Square image, at least 200x200 pixels
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="relative rounded-lg overflow-hidden border w-24 h-24">
                        <img
                          src={imageUploadUrl}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">
                          Image uploaded successfully
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => setImageUploadUrl("")}
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Social Links</h2>
            </div>
            <Separator className="mb-6" />

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormDescription>
                          Instagram username (without @)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter / X</FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormDescription>
                          Twitter username (without @)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="sticky bottom-0 bg-background border-t pt-4 pb-4 flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateForm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Author"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  )
}
