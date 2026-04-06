"use server";
import { revalidatePath } from "next/cache";

export const storeArticles = async (
  title: string,
  subtitle: string,
  slug: string,
  blog: string,
  author_id: string,
  category_id: string,
  keywords: string,
  image: string,
  image_alt: string
) => {
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
