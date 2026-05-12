"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function AddLeadModal() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [title, setTitle] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [saving, setSaving] = useState(false);

    const insertLead = useMutation(api.leads.insertSingleLead);

    const resetForm = () => {
        setEmail("");
        setName("");
        setCompany("");
        setTitle("");
        setPhone("");
        setWebsite("");
        setLocation("");
        setCategory("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) { toast.error("Email is required"); return; }

        setSaving(true);
        try {
            await insertLead({
                email: email.trim(),
                decisionMakerName: name.trim() || undefined,
                companyName: company.trim() || undefined,
                title: title.trim() || undefined,
                phone: phone.trim() || undefined,
                website: website.trim() || undefined,
                location: location.trim() || undefined,
                category: category.trim() || undefined,
            });
            toast.success(`${email} added to leads`);
            setOpen(false);
            resetForm();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to add lead");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-primary" />
                        Add Lead Manually
                    </DialogTitle>
                    <DialogDescription>
                        Add a single contact directly without importing a CSV file.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                    {/* Required */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="lead-email">
                            Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="lead-email"
                            type="email"
                            placeholder="john@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Two-column optional fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="lead-name">Contact Name</Label>
                            <Input
                                id="lead-name"
                                placeholder="John Smith"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="lead-company">Company</Label>
                            <Input
                                id="lead-company"
                                placeholder="Acme Corp"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="lead-title">Job Title</Label>
                            <Input
                                id="lead-title"
                                placeholder="CEO"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="lead-phone">Phone</Label>
                            <Input
                                id="lead-phone"
                                placeholder="+1 234 567 8900"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="lead-website">Website</Label>
                            <Input
                                id="lead-website"
                                placeholder="acme.com"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="lead-location">Location</Label>
                            <Input
                                id="lead-location"
                                placeholder="New York, USA"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="lead-category">Category</Label>
                            <Input
                                id="lead-category"
                                placeholder="e.g. SaaS Founders"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { setOpen(false); resetForm(); }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving || !email.trim()}>
                            {saving ? "Adding..." : "Add Lead"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
