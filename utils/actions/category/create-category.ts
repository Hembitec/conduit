"use server";

export const createCategory = async (category: string) => {
  const userId = "placeholder-user-id";

  if (!userId) {
    return null;
  }

  try {
    // TODO: Replace with Convex mutation
    return [] as unknown[];
  } catch (error: unknown) {
    return error;
  }
};
