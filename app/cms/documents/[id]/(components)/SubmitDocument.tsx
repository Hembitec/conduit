import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SubmitDocument({ html, id, title }: { html: string, id: string, title: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter()
  const actStoreDocument = useMutation(api.mutations.storeDocument);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (formData: any) => {
    setLoading(true)
    try {
      await actStoreDocument({ id: id as Id<"documents">, title: formData?.title, document: html })
      setLoading(false)
      toast("Document saved! Head to Publish Article to publish it.", {
        action: {
          label: "Publish",
          onClick: () => router.push("/cms/publish"),
        },
      })
      setOpen(false)
      reset()
      router.push("/cms/publish")
    } catch (error: any) {
      setLoading(false)
      toast.error(error.message || "Failed to submit document");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline">Submit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col items-start gap-4">
            <Label className="text-right">
              Name
            </Label>
            <Input
              {...register("title")}
              defaultValue={title}
              className="col-span-3"
            />
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
