"use client";

import { useMemo, useState, useEffect } from "react";
import { Lead } from "@/types";
import { Columns3, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STORAGE_KEY = "conduit-lead-columns";

export interface ColumnDef {
    key: string;
    label: string;
    isCustom?: boolean;
}

const BUILT_IN_COLUMNS: ColumnDef[] = [
    { key: "contact", label: "Contact" },
    { key: "company", label: "Company" },
    { key: "category", label: "Category" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "added", label: "Added" },
    { key: "phone", label: "Phone" },
    { key: "website", label: "Website" },
    { key: "location", label: "Location" },
];

const DEFAULT_VISIBLE = new Set(["contact", "company", "email", "status"]);

/** Discovers custom field keys from loaded lead data */
export function useCustomFieldKeys(leads: Lead[]): string[] {
    return useMemo(() => {
        const keys = new Set<string>();
        for (const lead of leads) {
            if (lead.customFields) {
                for (const key of Object.keys(lead.customFields)) keys.add(key);
            }
        }
        return Array.from(keys).sort();
    }, [leads]);
}

/** Manages visible columns state with localStorage persistence */
export function useColumnVisibility(customFieldKeys: string[]) {
    const [visible, setVisible] = useState<Set<string>>(() => {
        if (typeof window === "undefined") return DEFAULT_VISIBLE;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return new Set(JSON.parse(saved) as string[]);
        } catch { /* ignore */ }
        return new Set(DEFAULT_VISIBLE);
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(visible)));
        } catch { /* ignore */ }
    }, [visible]);

    const toggle = (key: string) => {
        setVisible((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const allColumns: ColumnDef[] = [
        ...BUILT_IN_COLUMNS,
        ...customFieldKeys.map((k) => ({ key: `cf:${k}`, label: k, isCustom: true })),
    ];

    return { visible, toggle, allColumns };
}

/** The column visibility toggle dropdown button */
export function ColumnToggle({
    allColumns,
    visible,
    onToggle,
}: {
    allColumns: ColumnDef[];
    visible: Set<string>;
    onToggle: (key: string) => void;
}) {
    const builtIn = allColumns.filter((c) => !c.isCustom);
    const custom = allColumns.filter((c) => c.isCustom);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-9">
                    <Columns3 className="h-3.5 w-3.5" />
                    Columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel className="text-xs">Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {builtIn.map((col) => (
                    <DropdownMenuCheckboxItem
                        key={col.key}
                        checked={visible.has(col.key)}
                        onCheckedChange={() => onToggle(col.key)}
                    >
                        {col.label}
                    </DropdownMenuCheckboxItem>
                ))}
                {custom.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Custom Fields
                        </DropdownMenuLabel>
                        {custom.map((col) => (
                            <DropdownMenuCheckboxItem
                                key={col.key}
                                checked={visible.has(col.key)}
                                onCheckedChange={() => onToggle(col.key)}
                            >
                                {col.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
