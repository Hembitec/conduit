"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";

interface UploadButtonProps {
    onUploadComplete: (url: string) => void;
    accept?: string;
    label?: string;
}

export function UploadButton({
    onUploadComplete,
    accept = "image/*",
    label = "Upload Image",
}: UploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            // 1. Request a presigned URL from our API
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                }),
            });

            if (!res.ok) throw new Error("Failed to get upload URL");

            const { presignedUrl, publicUrl } = await res.json();

            // 2. PUT the file directly to R2 using the presigned URL
            const uploadRes = await fetch(presignedUrl, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });

            if (!uploadRes.ok) throw new Error("Upload to R2 failed");

            // 3. Return the final public URL to the parent
            onUploadComplete(publicUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            // Reset file input
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                id="upload-input"
                onChange={handleFileChange}
            />
            <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="w-fit"
            >
                <UploadIcon className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : label}
            </Button>
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}
