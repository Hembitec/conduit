import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://conduitcms.com";

  const articles = await fetchQuery(api.blogs.getPublishedArticles);

  const items = articles.map((article) => {
    const pubDate = new Date(article._creationTime).toUTCString();
    const link = `${baseUrl}/blog/${article.slug}`;

    // Strip HTML tags for the description
    const plainText = (article.blogHtml || "")
      .replace(/<[^>]*>/g, "")
      .slice(0, 300);

    return `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${plainText}]]></description>
    </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Conduit CMS</title>
    <link>${baseUrl}</link>
    <description>Latest articles from Conduit CMS</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
