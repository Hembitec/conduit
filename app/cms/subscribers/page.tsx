"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Users, Download } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/EmptyState";

export default function SubscribersPage() {
  const subscribers = useQuery(api.subscribers.getSubscribers);
  const deleteSubscriber = useMutation(api.subscribers.deleteSubscriber);

  const handleDelete = async (id: Id<"subscribers">) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;
    try {
      await deleteSubscriber({ id });
      toast.success("Subscriber deleted");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to delete subscriber";
      toast.error(message);
    }
  };

  const handleExport = () => {
    if (!subscribers || subscribers.length === 0) return;
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Date Subscribed\n" 
      + subscribers.map((s: Doc<"subscribers">) => `${s.email},${new Date(s._creationTime).toISOString()}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (subscribers === undefined) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Newsletter Subscribers</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Newsletter Subscribers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your email list and export subscribers.
          </p>
        </div>
        
        {subscribers.length > 0 && (
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <EmptyState
          title="No subscribers yet"
          description="When readers subscribe to your newsletter, they will appear here."
          icon={Users}
        />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email Address</TableHead>
                <TableHead>Date Subscribed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((sub: Doc<"subscribers">) => (
                <TableRow key={sub._id}>
                  <TableCell className="font-medium">{sub.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(sub._creationTime), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(sub._id)}
                      className="text-muted-foreground hover:text-destructive"
                      title="Delete subscriber"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
