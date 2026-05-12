"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Plus, LayoutTemplate, Trash2, Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/EmptyState";
import { renderPreview } from "./(components)/TemplateEditor";
import { format } from "date-fns";
import Link from "next/link";

export default function TemplatesPage() {
    const templates = useQuery(api.emailTemplates.getTemplatesByUser);
    const deleteTemplate = useMutation(api.emailTemplates.deleteTemplate);
    const [previewId, setPreviewId] = useState<Id<"emailTemplates"> | null>(null);

    const handleDelete = async (id: Id<"emailTemplates">) => {
        if (!confirm("Delete this template?")) return;
        try {
            await deleteTemplate({ id });
            toast.success("Template deleted");
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to delete template";
            toast.error(msg);
        }
    };

    const previewTemplate = previewId
        ? templates?.find((t) => t._id === previewId)
        : null;

    if (templates === undefined) {
        return (
            <div className="flex w-full flex-col gap-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-40 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <main className="flex w-full flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/50 pb-6 mb-8">
                <div className="flex flex-col gap-1.5">
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium flex items-center gap-2">
                        <LayoutTemplate className="h-4 w-4" />
                        Outreach
                    </p>
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
                            Templates
                        </h1>
                        {templates !== undefined && (
                            <span className="text-xs font-medium text-muted-foreground rounded-full border border-border/60 bg-muted/20 px-2 py-0.5">
                                {templates.length} total
                            </span>
                        )}
                    </div>
                </div>

                {/* Link to full-page editor */}
                <Button className="gap-2" variant="secondary" asChild>
                    <Link href="/cms/outreach/templates/new">
                        <Plus className="h-4 w-4" />
                        New Template
                    </Link>
                </Button>
            </div>

            {/* Template Grid */}
            {templates.length === 0 ? (
                <EmptyState
                    title="No templates yet"
                    description="Create your first email template with dynamic variable placeholders."
                    icon={LayoutTemplate}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((t) => (
                        <div key={t._id} className="group relative rounded-lg border border-border/60 bg-card transition-colors duration-300 hover:border-primary/40 hover:bg-muted/10">
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-serif text-xl font-medium tracking-tight text-foreground mb-1">
                                        {t.name}
                                    </h3>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:text-primary"
                                            onClick={() => setPreviewId(t._id)}
                                            title="Quick Preview"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:text-primary"
                                            asChild
                                        >
                                            <Link href={`/cms/outreach/templates/${t._id}/edit`} title="Edit Template">
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(t._id)}
                                            title="Delete Template"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium mb-4 truncate uppercase tracking-wider">
                                    Subject: {t.subject}
                                </p>
                                <p className="text-xs text-muted-foreground/80 line-clamp-3 font-mono bg-muted/20 p-2 rounded border border-border/40">
                                    {t.body}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-4 uppercase tracking-widest">
                                    Created {format(new Date(t._creationTime), "MMM d, yyyy")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Preview Dialog (kept small — it's a quick glance, not the editor) */}
            <Dialog open={!!previewId} onOpenChange={(o) => { if (!o) setPreviewId(null); }}>
                <DialogContent className="sm:max-w-[640px] max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Template Preview</DialogTitle>
                        <DialogDescription>
                            Showing with sample data filled in
                        </DialogDescription>
                    </DialogHeader>
                    {previewTemplate && (
                        <div className="flex flex-col gap-4 mt-2 flex-1 min-h-0">
                            <div>
                                <Label className="text-xs text-muted-foreground">Subject</Label>
                                <p className="font-medium">{renderPreview(previewTemplate.subject)}</p>
                            </div>
                            <div className="flex-1 min-h-0 rounded-md border overflow-auto">
                                <iframe
                                    srcDoc={renderPreview(previewTemplate.body)}
                                    title="Email preview"
                                    className="w-full h-full min-h-[300px] border-0"
                                    sandbox="allow-same-origin"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={`/cms/outreach/templates/${previewTemplate._id}/edit`}
                                        onClick={() => setPreviewId(null)}
                                    >
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit This Template
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </main>
    );
}
