import { getArticleBySlugApi } from "@/utils/actions/api/get-article-slug-api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const result = { id: "placeholder-user-id" };
    const response = await getArticleBySlugApi(slug, result?.id!);

    if (response && typeof response === "object" && "error" in response && response.error) {
      return NextResponse.json({
        status: 400,
        message: "error",
        error: response.error,
      });
    }
    return NextResponse.json({
      status: 200,
      message: "success",
      response,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      status: 404,
      message: "failed",
      error: "unknown_error",
    });
  }
}
