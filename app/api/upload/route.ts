import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Auth-Key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("X-Auth-Key");

    if (!apiKey) {
        return NextResponse.json(
            { error: "Missing X-Auth-Key header" },
            { status: 401, headers: CORS_HEADERS }
        );
    }

    try {
        const profile = await fetchQuery(api.users.getUserByApiKey, { apiKey });
        if (!profile) {
            return NextResponse.json(
                { error: "Invalid API key" },
                { status: 403, headers: CORS_HEADERS }
            );
        }
    } catch {
        return NextResponse.json(
            { error: "Internal server error during auth" },
            { status: 500, headers: CORS_HEADERS }
        );
    }

    if (!r2Client) {
        return NextResponse.json(
            { error: "File upload is not configured" },
            { status: 503, headers: CORS_HEADERS }
        );
    }

    try {
        const body = await request.json();
        const { filename, contentType } = body as {
            filename: string;
            contentType: string;
        };

        if (!filename || !contentType) {
            return NextResponse.json(
                { error: "filename and contentType are required" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        // Restrict to images only to prevent arbitrary file hosting abuse
        if (!contentType.startsWith("image/")) {
            return NextResponse.json(
                { error: "Only image uploads are allowed" },
                { status: 422, headers: CORS_HEADERS }
            );
        }

        // Sanitise filename
        const safeFilename = filename
            .replace(/[^a-zA-Z0-9._-]/g, "-")
            .toLowerCase();
        const key = `uploads/${Date.now()}-${safeFilename}`;

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        const presignedUrl = await getSignedUrl(r2Client, command, {
            expiresIn: 300,
        });

        const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

        return NextResponse.json({ presignedUrl, publicUrl, key }, { headers: CORS_HEADERS });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to generate upload URL", detail: msg },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}

