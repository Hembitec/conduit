"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Papa from "papaparse";
import { Upload, ArrowRight, Check, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const LEAD_FIELDS = [
    { key: "email", label: "Email Address", required: true },
    { key: "companyName", label: "Company Name", required: false },
    { key: "decisionMakerName", label: "Contact Name", required: false },
    { key: "title", label: "Job Title", required: false },
    { key: "phone", label: "Phone", required: false },
    { key: "website", label: "Website", required: false },
    { key: "location", label: "Location", required: false },
    { key: "category", label: "Category", required: false },
] as const;

type FieldKey = (typeof LEAD_FIELDS)[number]["key"];

interface ImportLeadsModalProps {
    onImportComplete?: () => void;
}

export function ImportLeadsModal({ onImportComplete }: ImportLeadsModalProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"upload" | "map" | "importing" | "done">("upload");
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
    const [mapping, setMapping] = useState<Record<FieldKey, string>>({} as Record<FieldKey, string>);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState({ inserted: 0, skipped: 0 });

    const bulkInsert = useMutation(api.leads.bulkInsertLeads);

    const resetState = useCallback(() => {
        setStep("upload");
        setCsvHeaders([]);
        setCsvData([]);
        setMapping({} as Record<FieldKey, string>);
        setProgress(0);
        setResult({ inserted: 0, skipped: 0 });
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const headers = results.meta.fields ?? [];
                setCsvHeaders(headers);
                setCsvData(results.data as Record<string, string>[]);

                // Auto-map fields by fuzzy matching header names
                const autoMap: Record<string, string> = {};
                for (const field of LEAD_FIELDS) {
                    const match = headers.find(
                        (h) =>
                            h.toLowerCase().includes(field.key.toLowerCase()) ||
                            h.toLowerCase().includes(field.label.toLowerCase().split(" ")[0])
                    );
                    if (match) autoMap[field.key] = match;
                }
                setMapping(autoMap as Record<FieldKey, string>);
                setStep("map");
            },
            error: () => {
                toast.error("Failed to parse CSV file");
            },
        });
    };

    // Detect unmapped CSV columns that will be stored as customFields
    const mappedCsvColumns = new Set(
        Object.values(mapping).filter((v) => v && v !== "__skip__")
    );
    const unmappedColumns = csvHeaders.filter((h) => !mappedCsvColumns.has(h));

    const handleImport = async () => {
        if (!mapping.email) {
            toast.error("Email column mapping is required");
            return;
        }

        setStep("importing");

        // Transform CSV data using the mapping + capture extra columns
        const leads = csvData.map((row) => {
            const lead: Record<string, string | undefined> = {};
            for (const field of LEAD_FIELDS) {
                const csvColumn = mapping[field.key];
                if (csvColumn && row[csvColumn]) {
                    lead[field.key] = row[csvColumn].trim();
                }
            }
            // Collect unmapped columns into customFields
            const customFields: Record<string, string> = {};
            for (const col of unmappedColumns) {
                const val = row[col]?.trim();
                if (val) customFields[col] = val;
            }
            if (Object.keys(customFields).length > 0) {
                lead.customFields = JSON.stringify(customFields);
            }
            return lead as { email: string; [key: string]: string | undefined };
        }).filter((lead) => lead.email);

        // Chunk into batches of 100
        const BATCH_SIZE = 100;
        let totalInserted = 0;
        let totalSkipped = 0;

        for (let i = 0; i < leads.length; i += BATCH_SIZE) {
            const batch = leads.slice(i, i + BATCH_SIZE);
            try {
                // Re-parse customFields from serialized JSON string back to object
                const parsedBatch = batch.map((l) => {
                    const { customFields: cf, ...rest } = l;
                    const parsed = cf ? JSON.parse(cf) : undefined;
                    return { ...rest, customFields: parsed } as {
                        email: string;
                        customFields?: Record<string, string>;
                        [key: string]: string | Record<string, string> | undefined;
                    };
                });
                const res = await bulkInsert({ leads: parsedBatch });
                totalInserted += res.inserted;
                totalSkipped += res.skipped;
            } catch {
                totalSkipped += batch.length;
            }
            setProgress(Math.round(((i + batch.length) / leads.length) * 100));
        }

        setResult({ inserted: totalInserted, skipped: totalSkipped });
        setStep("done");
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) resetState();
    };

    const handleFinish = () => {
        handleOpenChange(false);
        if (result.inserted > 0) {
            toast.success(`Imported ${result.inserted} leads`);
            onImportComplete?.();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Import CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-primary" />
                        Import Leads
                    </DialogTitle>
                    <DialogDescription>
                        {step === "upload" && "Upload a CSV file containing your leads."}
                        {step === "map" && "Map your CSV columns to lead fields."}
                        {step === "importing" && "Importing your leads..."}
                        {step === "done" && "Import complete!"}
                    </DialogDescription>
                </DialogHeader>

                {/* Step 1: Upload */}
                {step === "upload" && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Upload className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <label
                            htmlFor="csv-upload"
                            className="cursor-pointer rounded-lg border-2 border-dashed px-8 py-4 text-center transition-colors hover:border-primary hover:bg-muted/50"
                        >
                            <p className="text-sm font-medium">Click to select a CSV file</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Supported: .csv files
                            </p>
                            <input
                                id="csv-upload"
                                type="file"
                                accept=".csv"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}

                {/* Step 2: Column Mapping */}
                {step === "map" && (
                    <div className="flex flex-col gap-4 mt-2">
                        <p className="text-xs text-muted-foreground">
                            Found {csvData.length} rows and {csvHeaders.length} columns
                        </p>
                        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
                            {LEAD_FIELDS.map((field) => (
                                <div key={field.key} className="flex items-center gap-3">
                                    <Label className="w-32 text-sm shrink-0">
                                        {field.label}
                                        {field.required && (
                                            <span className="text-destructive ml-0.5">*</span>
                                        )}
                                    </Label>
                                    <Select
                                        value={mapping[field.key] ?? "__skip__"}
                                        onValueChange={(val) =>
                                            setMapping((prev) => ({
                                                ...prev,
                                                [field.key]: val === "__skip__" ? "" : val,
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Skip" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="__skip__">Skip</SelectItem>
                                            {csvHeaders.map((h) => (
                                                <SelectItem key={h} value={h}>
                                                    {h}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                        {unmappedColumns.length > 0 && (
                            <div className="rounded-md border bg-muted/30 px-3 py-2">
                                <p className="text-xs font-medium text-muted-foreground">
                                    {unmappedColumns.length} extra column{unmappedColumns.length !== 1 ? "s" : ""} will also be imported as custom fields:
                                </p>
                                <p className="text-xs text-muted-foreground/80 mt-1">
                                    {unmappedColumns.join(", ")}
                                </p>
                            </div>
                        )}
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" onClick={() => setStep("upload")}>
                                Back
                            </Button>
                            <Button
                                onClick={handleImport}
                                disabled={!mapping.email}
                                className="gap-2"
                            >
                                Import {csvData.length} Leads
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Importing */}
                {step === "importing" && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-muted-foreground">{progress}% complete</p>
                    </div>
                )}

                {/* Step 4: Done */}
                {step === "done" && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold">
                                {result.inserted} leads imported
                            </p>
                            {result.skipped > 0 && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {result.skipped} duplicates or invalid entries skipped
                                </p>
                            )}
                        </div>
                        <Button onClick={handleFinish}>Done</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
