"use client"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { z } from "zod";
import { UploadButton } from "@/components/UploadButton";

const FormSchema = z.object({
  name: z.string(),
  instagram: z.string(),
  twitter: z.string()
})

export default function Author() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      instagram: "",
      twitter: ""
    }
  })

  const [imageUploadUrl, setImageUploadUrl] = useState<string>("");
  const actCreateAuthor = useMutation(api.mutations.createAuthor);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await actCreateAuthor({
        name: data?.name,
        instagram: data?.instagram,
        twitter: data?.twitter,
        profileImg: imageUploadUrl || undefined
      });
      toast("Author has been created");
      form.reset()
      setImageUploadUrl("");
      return response
    } catch (error: any) {
      toast.error(error.message || "Failed to create author");
      return error
    }
  }

  return (
    <main className="flex w-full mt-4 flex-col items-center justify-between ">
      <div className="flex flex-col gap-3 mb-20 w-full px-8">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
          Create an Author
        </h1>
        <p className="leading-7">
          Create an author to add to your articles
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[600px] space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your name</FormLabel>
                  <FormControl>
                    <Input  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your instagram username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="heytorontofoodie" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your twitter username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="heytorontofoodie" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col justify-center items-start w-full gap-3">
              <Label>Upload Author Image</Label>
              <UploadButton
                onUploadComplete={(url) => setImageUploadUrl(url)}
                label="Select Profile Image"
              />
              {imageUploadUrl !== "" && <div className="flex flex-col justify-center items-start w-full gap-3 mt-2">
                <Label>Image Url</Label>
                <Input value={imageUploadUrl} onChange={(e) => setImageUploadUrl(e.target.value)} />
              </div>}
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </main>
  )
}