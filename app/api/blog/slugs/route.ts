import { getArticlesSlugApi } from "@/utils/actions/api/get-articles-slugs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = { id: "placeholder-user-id" };
    const response = await getArticlesSlugApi(result?.id!);

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
