"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TemplateEditor } from "../(components)/TemplateEditor";

export default function NewTemplatePage() {
    const createTemplate = useMutation(api.emailTemplates.createTemplate);
    const customFieldKeys = useQuery(api.leads.getCustomFieldKeys) ?? [];
    const router = useRouter();

    const handleSave = async (data: { name: string; subject: string; body: string }) => {
        if (!data.name || !data.subject || !data.body) {
            toast.error("All fields are required");
            return;
        }
        try {
            await createTemplate(data);
            toast.success("Template created");
            router.push("/cms/outreach/templates");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to create template");
        }
    };

    return (
        <main className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
            {/* Editor */}
            <TemplateEditor
                title="New Email Template"
                backHref="/cms/outreach/templates"
                onSave={handleSave}
                saveLabel="Create Template"
                savingLabel="Creating..."
                customFieldKeys={customFieldKeys}
            />
        </main>
    );
}
