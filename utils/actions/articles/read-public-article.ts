"use server";

export const readPublicArticle = async (id: string) => {
  try {
    // TODO: Replace with Convex query
    return [] as Record<string, unknown>[];
  } catch (error: unknown) {
    return error;
  }
};
