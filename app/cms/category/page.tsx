"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ConvexError } from "convex/values"
import { toast } from "sonner"
import { z } from "zod"
import { Loader2, Tag, ArrowLeft } from "lucide-react"
import { CategoriesList } from "./(components)/CategoriesList"

const FormSchema = z.object({
  category: z.string().min(1, "Name is required").min(2, "Name should be at least 2 characters"),
})

export default function Category() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: "",
    },
  })

  const actCreateCategory = useMutation(api.categories.createCategory)

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true)
    try {
      await actCreateCategory({ name: data?.category })
      toast.success("Category created successfully")
      form.reset()
      setShowCreateForm(false)
    } catch (error: unknown) {
      const message = error instanceof ConvexError
        ? (error.data as string)
        : "Failed to create category"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!showCreateForm) {
    return (
      <main className="w-full max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Categories
            </h1>
            <p className="text-muted-foreground">
              Manage categories to organize your articles
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="gap-2"
          >
            <Tag className="h-4 w-4" />
            New Category
          </Button>
        </div>

        <CategoriesList onCreateNew={() => setShowCreateForm(true)} />
      </main>
    )
  }

  return (
    <main className="w-full max-w-xl mx-auto pb-20">
      <Button
        variant="ghost"
        onClick={() => setShowCreateForm(false)}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Categories
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Create Category
        </h1>
        <p className="text-muted-foreground">
          Add a new category to organize your articles
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
