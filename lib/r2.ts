import { S3Client } from "@aws-sdk/client-s3";

// Graceful guard — only throw at runtime, not at build/import time
const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

// r2Client will be null when env vars are missing (e.g. CI/preview builds)
export const r2Client =
    accountId && accessKeyId && secretAccessKey
        ? new S3Client({
            region: "auto",
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: { accessKeyId, secretAccessKey },
        })
        : null;

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "conduit";
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_DEV_URL || "";
