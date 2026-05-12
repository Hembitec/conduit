"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Lead } from "@/types";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { format } from "date-fns";

interface EditLeadDrawerProps {
    lead: Lead | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditLeadDrawer({ lead, open, onOpenChange }: EditLeadDrawerProps) {
    const updateLead = useMutation(api.leads.updateLead);

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [title, setTitle] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [saving, setSaving] = useState(false);

    // Reset form when a different lead is opened
    useEffect(() => {
        if (lead) {
            setEmail(lead.email);
            setName(lead.decisionMakerName ?? "");
            setCompany(lead.companyName ?? "");
            setTitle(lead.title ?? "");
            setPhone(lead.phone ?? "");
            setWebsite(lead.website ?? "");
            setLocation(lead.location ?? "");
            setCategory(lead.category ?? "");
        }
    }, [lead]);

    const handleSave = async () => {
        if (!lead) return;
        if (!email.trim()) {
            toast.error("Email is required");
            return;
        }
        setSaving(true);
        try {
            await updateLead({
                leadId: lead._id,
                email: email.trim(),
                decisionMakerName: name.trim() || undefined,
                companyName: company.trim() || undefined,
                title: title.trim() || undefined,
                phone: phone.trim() || undefined,
                website: website.trim() || undefined,
                location: location.trim() || undefined,
                category: category.trim() || undefined,
            });
            toast.success("Lead updated");
            onOpenChange(false);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update lead");
        } finally {
            setSaving(false);
        }
    };

    if (!lead) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[420px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="font-serif text-xl tracking-tight">
                        Edit Lead
                    </SheetTitle>
                    <SheetDescription>
                        Update this lead&apos;s information.
                    </SheetDescription>
                </SheetHeader>

                {/* Meta badges */}
                <div className="flex items-center gap-2 mt-4 mb-6">
                    <Badge variant="secondary" className="text-xs">
                        {lead.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        Added {format(new Date(lead._creationTime), "MMM d, yyyy")}
                    </span>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="edit-email">
                            Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="edit-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="edit-name">Contact Name</Label>
                            <Input
                                id="edit-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Smith"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="edit-title">Job Title</Label>
                            <Input
                                id="edit-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="CEO"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="edit-company">Company</Label>
                        <Input
                            id="edit-company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Acme Corp"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input
                                id="edit-phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 555 0100"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="edit-website">Website</Label>
                            <Input
                                id="edit-website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="acme.com"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="edit-location">Location</Label>
                            <Input
                                id="edit-location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="New York, USA"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Input
                                id="edit-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="SaaS Founders"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t mt-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
