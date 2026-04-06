"use server";

export const userCreate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
}: {
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  user_id: string;
}) => {
  // TODO: Replace with Convex mutation in Phase 4
  return { email, first_name, last_name, profile_image_url, user_id };
};
