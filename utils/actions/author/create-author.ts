"use server";

export const createAuthor = async (
  name: string,
  instagram: string,
  twitter: string,
  image_url: string
) => {
  const userId = "placeholder-user-id";

  if (!userId) {
    return null;
  }

  try {
    // TODO: Replace with Convex mutation
    return { data: null, error: null };
  } catch (error: unknown) {
    return { data: null, error };
  }
};
