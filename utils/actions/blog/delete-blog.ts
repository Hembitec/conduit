"use server";
import { revalidatePath } from "next/cache";

export const deleteBlog = async (slug: string) => {
  const userId = "placeholder-user-id";

  if (!userId) {
    return null;
  }

  try {
    // TODO: Replace with Convex mutation
    revalidatePath("/cms/documents");
    return [] as unknown[];
  } catch (error: unknown) {
    return error;
  }
};
