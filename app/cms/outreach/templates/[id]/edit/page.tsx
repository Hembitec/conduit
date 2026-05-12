"use client";

import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TemplateEditor } from "../../(components)/TemplateEditor";

interface EditTemplatePageProps {
    params: Promise<{ id: string }>;
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
    const { id } = use(params);
    const template = useQuery(api.emailTemplates.getTemplateById, {
        id: id as Id<"emailTemplates">,
    });
    const updateTemplate = useMutation(api.emailTemplates.updateTemplate);
    const customFieldKeys = useQuery(api.leads.getCustomFieldKeys) ?? [];
    const router = useRouter();

    const handleSave = async (data: { name: string; subject: string; body: string }) => {
        if (!data.name || !data.subject || !data.body) {
            toast.error("All fields are required");
            return;
        }
        try {
            await updateTemplate({
                id: id as Id<"emailTemplates">,
                name: data.name,
                subject: data.subject,
                body: data.body,
            });
            toast.success("Template updated");
            router.push("/cms/outreach/templates");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update template");
        }
    };

    // Loading state
    if (template === undefined) {
        return (
            <main className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-6 w-64" />
                </div>
                <Skeleton className="h-11 w-full" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-[500px]" />
                    <Skeleton className="h-[500px]" />
                </div>
            </main>
        );
    }

    // Not found
    if (template === null) {
        return (
            <main className="flex flex-col items-center justify-center gap-4 py-20">
                <p className="text-muted-foreground">Template not found</p>
                <Button variant="outline" asChild>
                    <Link href="/cms/outreach/templates">Back to Templates</Link>
                </Button>
            </main>
        );
    }

    return (
        <main className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
            {/* Editor pre-filled with template data */}
            <TemplateEditor
                title="Edit Template"
                backHref="/cms/outreach/templates"
                initialName={template.name}
                initialSubject={template.subject}
                initialBody={template.body}
                onSave={handleSave}
                saveLabel="Update Template"
                savingLabel="Updating..."
                customFieldKeys={customFieldKeys}
            />
        </main>
    );
}
