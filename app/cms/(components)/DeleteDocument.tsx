"use client"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export default function DeleteDocument({ id }: { id: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const actDeleteDocument = useMutation(api.mutations.deleteDocument);

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button>Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete document</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your document?
          </DialogDescription>
        </DialogHeader>
        <Button type="submit" onClick={async () => {
          try {
            const response = await actDeleteDocument({ id: id as Id<"documents"> });
            setOpen(false)
            router.push("/cms/documents")
            return response
          } catch (error: any) {
            toast.error(error.message || "Failed to delete document");
            return error
          }
        }}>Delete</Button>
      </DialogContent>
    </Dialog>)
}
