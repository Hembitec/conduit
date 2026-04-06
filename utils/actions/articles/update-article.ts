"use server";
import { revalidatePath } from "next/cache";

export const updateArticle = async (slug: string, blog: string) => {
  const userId = "placeholder-user-id";

  if (!userId) {
    return null;
  }

  try {
    // TODO: Replace with Convex mutation
    revalidatePath("/cms");
    return [] as unknown[];
  } catch (error: unknown) {
    return error;
  }
};
