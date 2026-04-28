import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

// GET /api/blog/[slug]/comments
// Returns approved comments for a specific article.
// Requires X-Auth-Key header — scoped to the key owner's articles only.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const apiKey = request.headers.get("X-Auth-Key");

  if (!apiKey) {
    return NextResponse.json(
      { status: 401, message: "Missing X-Auth-Key header" },
      { status: 401 }
    );
  }

  try {
    const profile = await fetchQuery(api.users.getUserByApiKey, { apiKey });
    if (!profile) {
      return NextResponse.json(
        { status: 403, message: "Invalid API key" },
        { status: 403 }
      );
    }

    // Verify article belongs to key owner
    const article = await fetchQuery(api.blogs.getArticleBySlugAndUser, {
      slug,
      userId: profile.userId,
    });

    if (!article) {
      return NextResponse.json(
        { status: 404, message: "Article not found" },
        { status: 404 }
      );
    }

    const comments = await fetchQuery(
      api.comments.getApprovedCommentsByBlog,
      { blogId: article._id }
    );

    return NextResponse.json({ status: 200, message: "success", data: comments });
  } catch {
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/blog/[slug]/comments
// Submit a new comment on an article. No API key required — public action.
// Comments are stored with approved: false and require moderation.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: 400, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { authorName, authorEmail, content } = body as Record<string, unknown>;

  if (
    typeof authorName !== "string" || !authorName.trim() ||
    typeof authorEmail !== "string" || !authorEmail.trim() ||
    typeof content !== "string" || !content.trim()
  ) {
    return NextResponse.json(
      { status: 422, message: "authorName, authorEmail, and content are required" },
      { status: 422 }
    );
  }

  try {
    // Find the article by slug — must be published
    const article = await fetchQuery(api.blogs.readPublicArticle, { slug });
    if (!article || !article.published) {
      return NextResponse.json(
        { status: 404, message: "Article not found" },
        { status: 404 }
      );
    }

    // Use fetchMutation to call Convex directly — type-safe, no raw HTTP needed
    await fetchMutation(api.comments.createComment, {
      blogId: article._id,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      content: content.trim(),
    });

    return NextResponse.json(
      {
        status: 201,
        message: "Comment submitted. It will appear after moderation.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
