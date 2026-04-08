"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from "convex/react";
import { ClipboardCheckIcon, Edit, Share } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form'
import { api } from "@/convex/_generated/api";
import { toast } from 'sonner'
import { ConvexError } from "convex/values";

export default function ManageArticle({ params }: {
  params: {
    slug: string
  }
}) {

  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const router = useRouter()

  const actDeleteBlog = useMutation(api.mutations.deleteBlog);
  const actStatusBlog = useMutation(api.mutations.statusBlog);
  const actShareArticle = useMutation(api.mutations.shareArticle);

  const data = useQuery(api.queries.getArticleBySlug, { slug: params?.slug });
  const isPending = data === undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (submitData: any) => {
    const shareSetting = submitData.shareSetting === 'true';
    try {
      const response = await actShareArticle({ slug: params?.slug, shareable: shareSetting });
      toast("Article shareability changed");
      return response;
    } catch (error: unknown) {
      const message = error instanceof ConvexError ? (error.data as string) : "Failed to update shareability";
      toast.error(message);
    }
  };


  return (
    <div className='flex justify-end items-center w-full gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="outline">
            <Share />
          </Button>
        </PopoverTrigger>
        {!isPending &&
          <PopoverContent className="w-80">
            <h4 className="font-medium leading-none">
              Shareability
            </h4>
            <Separator className='w-full mt-3' />
            <form onSubmit={handleSubmit(onSubmit)}>
              {<RadioGroup defaultValue={data?.shareable ? "true" : "false"} {...register("shareSetting")} className='flex flex-col gap-2 py-3'>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="publicOption" />
                  <Label>Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="privateOption" />
                  <Label>Private</Label>
                </div>
              </RadioGroup>}
              <Button type='submit' variant="outline">Update</Button>
            </form>
            <div className='flex gap-2 mt-4'>
              <Input defaultValue={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/article/public/${data?.slug}`} />
              <Button size="icon" disabled={!data?.shareable} onClick={() => {
                navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/article/public/${data?.slug}`)
                toast("Public article url has been copied")
              }}>
                <ClipboardCheckIcon />
              </Button>
            </div>
          </PopoverContent>}

      </Popover>

      <Link href={`/cms/preview/${params?.slug}/edit`}>
        <Button size="icon" variant="outline">
          <Edit />
        </Button>
      </Link>
      <Dialog open={openDelete} onOpenChange={setOpenDelete} >
        <DialogTrigger asChild>
          <Button size="sm">Delete</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article?
            </DialogDescription>
          </DialogHeader>
          <Button type="submit" size="sm" onClick={async () => {
            try {
              await actDeleteBlog({ slug: params?.slug })
              setOpenDelete(false)
              router.push("/cms")
            } catch (error: unknown) {
              const message = error instanceof ConvexError ? (error.data as string) : "Failed to delete article";
              toast.error(message);
            }
          }}>Yes, Delete</Button>
        </DialogContent>
      </Dialog>
      {data?.published ?
        <Dialog open={open} onOpenChange={setOpen} >
          <DialogTrigger asChild>
            <Button variant="outline">Unpublish</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Unpublish Article</DialogTitle>
              <DialogDescription>
                Are you sure you want to unpublish this article?.
              </DialogDescription>
            </DialogHeader>
            <Button type="submit" onClick={async () => {
              try {
                await actStatusBlog({ slug: params?.slug, published: !data?.published })
                setOpen(false)
              } catch (error: unknown) {
                const message = error instanceof ConvexError ? (error.data as string) : "Failed to update status";
                toast.error(message);
              }
            }}>Yes, Unpublish</Button>
          </DialogContent>
        </Dialog> : <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Publish</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Publish Article</DialogTitle>
              <DialogDescription>
                Are you sure you want to publish this article?.
              </DialogDescription>
            </DialogHeader>
            <Button type="submit" onClick={async () => {
              try {
                await actStatusBlog({ slug: params?.slug, published: !data?.published })
                setOpen(false)
              } catch (error: unknown) {
                const message = error instanceof ConvexError ? (error.data as string) : "Failed to update status";
                toast.error(message);
              }
            }}>Yes, Publish</Button>
          </DialogContent>
        </Dialog>}
    </div>)
}
