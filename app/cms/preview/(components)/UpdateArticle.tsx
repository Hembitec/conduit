import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function UpdateArticle({ html, slug }: { html: string, slug: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const actUpdateArticle = useMutation(api.blogs.updateArticle);


  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Article</DialogTitle>
        </DialogHeader>
        <Button type="submit" onClick={async () => {
          try {
            const response = await actUpdateArticle({ slug, blogHtml: html });
            toast("Article has been updated");
            setOpen(false);
            return response;
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to update article"
            toast.error(message);
            return error
          }
        }}>Save changes</Button>
      </DialogContent>
    </Dialog>
  )
}
