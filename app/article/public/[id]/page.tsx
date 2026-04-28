import { redirect } from 'next/navigation';

export default async function LegacyArticleRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Permanent redirect to the new SEO-friendly route
  redirect(`/blog/${id}`);
}
