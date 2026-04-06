"use server";

export const getDocumentById = async (id: string) => {
  const userId = "placeholder-user-id";

  if (!userId) {
    return null;
  }

  try {
    // TODO: Replace with Convex query
    return [] as unknown[];
  } catch (error: unknown) {
    return error;
  }
};
