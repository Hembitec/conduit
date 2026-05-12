"use client";

import { useState, useRef, useCallback } from "react";
import { Code, FileText, Eye, EyeOff, Smartphone, Monitor, ArrowLeft, Braces, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Template Variables ──────────────────────────────────────────

export const TEMPLATE_VARIABLES = [
    { key: "{{companyName}}", label: "Company" },
    { key: "{{decisionMakerName}}", label: "Name" },
    { key: "{{title}}", label: "Title" },
    { key: "{{website}}", label: "Website" },
    { key: "{{location}}", label: "Location" },
    { key: "{{email}}", label: "Email" },
    { key: "{{phone}}", label: "Phone" },
    { key: "{{category}}", label: "Category" },
];

const SAMPLE_DATA: Record<string, string> = {
    "{{companyName}}": "Acme Corp",
    "{{decisionMakerName}}": "John Smith",
    "{{title}}": "CEO",
    "{{website}}": "acme.com",
    "{{location}}": "New York",
    "{{email}}": "john@acme.com",
    "{{phone}}": "+1 555 0100",
    "{{category}}": "SaaS Founders",
};

export function renderPreview(text: string): string {
    let result = text;
    for (const [key, value] of Object.entries(SAMPLE_DATA)) {
        result = result.replace(new RegExp(key.replace(/[{}]/g, "\\$&"), "g"), value);
    }
    return result;
}

// ─── Component Props ─────────────────────────────────────────────

export interface TemplateEditorProps {
    title: string;
    backHref: string;
    initialName?: string;
    initialSubject?: string;
    initialBody?: string;
    onSave: (data: { name: string; subject: string; body: string }) => Promise<void>;
    saveLabel?: string;
    savingLabel?: string;
    customFieldKeys?: string[];
}

// ─── Main Editor Component ───────────────────────────────────────

export function TemplateEditor({
    title,
    backHref,
    initialName = "",
    initialSubject = "",
    initialBody = "",
    onSave,
    saveLabel = "Save Template",
    savingLabel = "Saving...",
    customFieldKeys = [],
}: TemplateEditorProps) {
    const [name, setName] = useState(initialName);
    const [subject, setSubject] = useState(initialSubject);
    const [body, setBody] = useState(initialBody);
    const [bodyMode, setBodyMode] = useState<"html" | "text">("html");
    const [previewWidth, setPreviewWidth] = useState<"desktop" | "mobile">("desktop");
    const [showPreview, setShowPreview] = useState(true);
    const [saving, setSaving] = useState(false);

    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const subjectRef = useRef<HTMLInputElement>(null);

    // Insert variable at cursor position
    const insertVariable = useCallback(
        (variable: string, target: "subject" | "body") => {
            if (target === "subject" && subjectRef.current) {
                const el = subjectRef.current;
                const start = el.selectionStart ?? el.value.length;
                const end = el.selectionEnd ?? start;
                const newVal =
                    el.value.substring(0, start) + variable + el.value.substring(end);
                setSubject(newVal);
                // Restore cursor after the inserted variable
                requestAnimationFrame(() => {
                    el.focus();
                    el.setSelectionRange(start + variable.length, start + variable.length);
                });
            } else if (target === "body" && bodyRef.current) {
                const el = bodyRef.current;
                const start = el.selectionStart ?? el.value.length;
                const end = el.selectionEnd ?? start;
                const newVal =
                    el.value.substring(0, start) + variable + el.value.substring(end);
                setBody(newVal);
                requestAnimationFrame(() => {
                    el.focus();
                    el.setSelectionRange(start + variable.length, start + variable.length);
                });
            }
        },
        []
    );

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave({ name: name.trim(), subject: subject.trim(), body: body.trim() });
        } finally {
            setSaving(false);
        }
    };

    const canSave = name.trim() && subject.trim() && body.trim();

    return (
        <div className="flex flex-col h-full min-h-0 overflow-hidden">
            {/* ── Header Area ── */}
            <div className="flex items-center justify-between gap-4 shrink-0 pb-3 border-b">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                        <Link href={backHref}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline-block">{title}</span>
                        <span className="text-muted-foreground/40 hidden sm:inline-block">/</span>
                        <Input
                            placeholder="Untitled Template..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-8 border-transparent bg-transparent hover:bg-muted/50 focus-visible:bg-transparent focus-visible:ring-0 focus-visible:border-primary text-base font-semibold px-2 py-1 shadow-none w-[200px] sm:w-[300px]"
                        />
                    </div>
                </div>
                
                <Button
                    onClick={handleSave}
                    disabled={saving || !canSave}
                    size="sm"
                    className="gap-2 shrink-0 shadow-sm min-w-[120px]"
                >
                    {saving ? savingLabel : saveLabel}
                </Button>
            </div>

            {/* Split Panel: Editor + Preview */}
            <div className={cn("flex-1 grid gap-4 min-h-0 mt-4", showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
                {/* ── Left Panel: Editor ── */}
                <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
                    {/* Subject Line & Tools row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0">
                        <Input
                            id="tpl-subject"
                            ref={subjectRef}
                            placeholder="Subject: e.g., Quick question about {{companyName}}"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 shadow-sm font-medium"
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 shadow-sm shrink-0">
                                    <Braces className="h-4 w-4 text-muted-foreground" />
                                    <span className="hidden sm:inline-block">Insert</span>
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[220px]">
                                {TEMPLATE_VARIABLES.map((v) => (
                                    <DropdownMenuItem
                                        key={v.key}
                                        onClick={() => insertVariable(v.key, "body")}
                                        className="gap-2 cursor-pointer"
                                    >
                                        <Badge variant="secondary" className="font-mono text-[10px] uppercase bg-muted/50">{v.key}</Badge>
                                        <span className="text-xs">{v.label}</span>
                                    </DropdownMenuItem>
                                ))}
                                {customFieldKeys.length > 0 && (
                                    <>
                                        <div className="my-1 mx-2 border-t border-border/40" />
                                        <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                                            Custom Fields
                                        </p>
                                        {customFieldKeys.map((key) => (
                                            <DropdownMenuItem
                                                key={key}
                                                onClick={() => insertVariable(`{{${key}}}`, "body")}
                                                className="gap-2 cursor-pointer"
                                            >
                                                <Badge variant="outline" className="font-mono text-[10px] bg-muted/30">{`{{${key}}}`}</Badge>
                                                <span className="text-xs">{key}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* HTML / Plain Text Tabs */}
                    <Tabs
                        value={bodyMode}
                        onValueChange={(v) => setBodyMode(v as "html" | "text")}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        {/* Toolbar: mode tabs + preview toggle */}
                        <div className="flex items-center gap-2">
                            <TabsList className="w-fit">
                                <TabsTrigger value="html" className="gap-1.5 text-xs">
                                    <Code className="h-3.5 w-3.5" />
                                    HTML
                                </TabsTrigger>
                                <TabsTrigger value="text" className="gap-1.5 text-xs">
                                    <FileText className="h-3.5 w-3.5" />
                                    Plain Text
                                </TabsTrigger>
                            </TabsList>
                            {/* Icon-only preview toggle */}
                            <Button
                                type="button"
                                variant={showPreview ? "secondary" : "ghost"}
                                size="icon"
                                className="h-8 w-8 ml-auto"
                                onClick={() => setShowPreview((p) => !p)}
                                title={showPreview ? "Hide preview" : "Show preview"}
                            >
                                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>

                        {/* HTML mode — dark code editor feel */}
                        <TabsContent value="html" className="flex-1 mt-2 min-h-0">
                            <Textarea
                                ref={bodyRef}
                                placeholder={"<!DOCTYPE html>\n<html>\n<body>\n  <p>Hi {{decisionMakerName}},</p>\n  <p>I noticed {{companyName}}...</p>\n</body>\n</html>"}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className={cn(
                                    "font-mono text-[13px] leading-6 resize-none",
                                    "flex-1 min-h-0 h-full",
                                    "bg-[hsl(var(--code-bg,220_14%_10%))] text-[hsl(var(--code-fg,210_40%_85%))] border-[hsl(var(--border))]",
                                    "placeholder:text-muted-foreground/40 rounded-md shadow-inner"
                                )}
                                style={{ height: "100%" }}
                                spellCheck={false}
                            />
                        </TabsContent>

                        {/* Plain Text mode — comfortable document feel */}
                        <TabsContent value="text" className="flex-1 mt-2 min-h-0">
                            <Textarea
                                ref={bodyRef}
                                placeholder={"Hi {{decisionMakerName}},\n\nI noticed {{companyName}} is doing great work in {{location}}.\n\nWould love to connect.\n\nBest,\nYour Name"}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className={cn(
                                    "text-base leading-relaxed resize-none",
                                    "flex-1 min-h-0 h-full",
                                    "max-w-prose mx-auto w-full shadow-none border-0",
                                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                                    "placeholder:text-muted-foreground/40"
                                )}
                                style={{ height: "100%" }}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* ── Right Panel: Live Preview (toggleable) ── */}
                {showPreview && (
                    /* Preview panel — overflow auto, no double scrollbar */
                    <div className="flex flex-col gap-2 min-h-0 overflow-hidden border rounded-lg bg-muted/20 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Live Preview
                                </span>
                                <Badge variant="secondary" className="text-[10px]">
                                    Sample data
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant={previewWidth === "desktop" ? "secondary" : "ghost"}
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setPreviewWidth("desktop")}
                                    title="Desktop preview"
                                >
                                    <Monitor className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant={previewWidth === "mobile" ? "secondary" : "ghost"}
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setPreviewWidth("mobile")}
                                    title="Mobile preview"
                                >
                                    <Smartphone className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>

                        {/* Rendered subject */}
                        {subject.trim() && (
                            <div className="rounded-md border bg-background px-3 py-2">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Subject</p>
                                <p className="text-sm font-medium">{renderPreview(subject)}</p>
                            </div>
                        )}

                        {/* Rendered body */}
                        <div
                            className={cn(
                                "flex-1 overflow-auto rounded-md border bg-background",
                                previewWidth === "mobile" ? "max-w-[375px] mx-auto w-full" : "w-full"
                            )}
                        >
                            {body.trim() ? (
                                bodyMode === "html" ? (
                                    <iframe
                                        srcDoc={renderPreview(body)}
                                        title="Email preview"
                                        className="w-full border-0"
                                    style={{ height: "100%", minHeight: "200px" }}
                                        sandbox="allow-same-origin"
                                    />
                                ) : (
                                    <div className="p-4 text-sm whitespace-pre-wrap">
                                        {renderPreview(body)}
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center justify-center h-full min-h-[300px] text-muted-foreground text-sm">
                                    Start typing to see a live preview
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
