import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";

export async function POST(request: NextRequest) {
    if (!r2Client) {
        return NextResponse.json(
            { error: "File upload is not configured" },
            { status: 503 }
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
                { status: 400 }
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

        return NextResponse.json({ presignedUrl, publicUrl, key });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to generate upload URL", detail: msg },
            { status: 500 }
        );
    }
}

