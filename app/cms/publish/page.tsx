"use client"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UploadButton } from "@/components/UploadButton";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string(),
  slug: z.string().min(1, "Slug is required"),
  keywords: z.string(),
  image_alt: z.string(),
  author: z.string(),
  category: z.string(),
  article: z.string().min(1, "Please select a document")
})

export default function Publish() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      slug: "",
      keywords: "",
      image_alt: "",
      author: "",
      category: "",
      article: ""
    }
  })

  const [imageUploadUrl, setImageUploadUrl] = useState<string>("")
  const router = useRouter()

  const documentData = useQuery(api.queries.getAllDocuments);
  const authorsData = useQuery(api.queries.getAllAuthors);
  const categoryData = useQuery(api.queries.getAllCategories);

  // W2-3: Auto-generate slug from title
  const titleValue = form.watch("title")
  useEffect(() => {
    if (titleValue) {
      const slug = titleValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
      form.setValue("slug", slug, { shouldValidate: false })
    }
  }, [titleValue, form])

  const actStoreArticles = useMutation(api.mutations.storeArticle);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // A5 fix: look up the actual HTML from the fetched documentData by ID
    const selectedDoc = documentData?.find((d: any) => d._id === data.article);
    const blogHtml = selectedDoc?.document ?? "";
    try {
      const response = await actStoreArticles({
        title: data?.title,
        subtitle: data?.subtitle,
        slug: data?.slug,
        blogHtml,
        authorId: data?.author as Id<"authors">,
        categoryId: data?.category as Id<"categories">,
        keywords: data?.keywords ? data.keywords.split(",").map((k: string) => k.trim()).filter(Boolean) : [],
        imageAlt: data?.image_alt,
        image: imageUploadUrl
      });
      toast("Article is published");
      form.reset();
      setImageUploadUrl("");
      // W2-5: redirect to dashboard to see the new article
      router.push("/cms");
      return response;
    } catch (error: unknown) {
      const message = error instanceof ConvexError
        ? (error.data as string)
        : "Failed to publish article";
      toast.error(message);
      return error;
    }
  }


  return (
    <main className="flex min-w-screen mt-4 flex-col items-center justify-between ">
      <div className="flex flex-col gap-3 mb-20 w-full px-8">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
          Publish
        </h1>
        <p className="leading-7">
          Get ready to publish articles that have been written and saved
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter title here</FormLabel>
                  <FormControl>
                    <Input  {...field} />
                  </FormControl>
                  <FormDescription>This is your article title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter subtitle here</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>This is your article subtitle.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center items-center w-full gap-3">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Enter slug here</FormLabel>
                    <FormControl>
                      <Input  {...field} />
                    </FormControl>
                    <FormDescription>This is your article slug.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Enter keywords here</FormLabel>
                    <FormControl>
                      <Input  {...field} placeholder="Pizza, Chicken, Food" />
                    </FormControl>
                    <FormDescription>Separate keywords by comma.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col justify-center items-start w-full gap-3">
              <Label>Upload Article Image</Label>
              <UploadButton
                onUploadComplete={(url) => setImageUploadUrl(url)}
                label="Select Article Image"
              />
              {imageUploadUrl !== "" && <div className="flex flex-col justify-center items-start w-full gap-3 mt-2">
                <Label>Image Url</Label>
                <Input value={imageUploadUrl} onChange={(e) => setImageUploadUrl(e.target.value)} />
              </div>}
            </div>
            <FormField
              control={form.control}
              name="image_alt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Enter Image alt text</FormLabel>
                  <FormControl>
                    <Input placeholder="Image alt text" {...field} />
                  </FormControl>
                  <FormDescription>This is your image alt text.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center items-center w-full gap-3">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Author</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an author" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {authorsData?.map((info: any) => (
                          <div key={info?._id}>
                            <SelectItem value={info?._id}>{info?.name}</SelectItem>
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryData?.map((info: any) => (
                          <div key={info?._id}>
                            <SelectItem value={String(info?._id)}>{info?.name}</SelectItem>
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="article"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a document" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentData?.map((info: any) => (
                        <div key={info?._id}>
                          <SelectItem value={info?._id}>{info?.title}</SelectItem>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>

      </div>
    </main>
  )
}