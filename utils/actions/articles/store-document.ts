"use server";
import { revalidatePath } from "next/cache";

export const storeDocument = async (
  title: string,
  blog: string,
  id: string
) => {
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
