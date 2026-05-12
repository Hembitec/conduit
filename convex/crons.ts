import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Process active outreach campaigns every 5 minutes.
// Each tick sends a batch of emails proportional to the campaign's rate limit.
crons.interval(
    "process-outreach-campaigns",
    { minutes: 5 },
    internal.outreachCron.processActiveCampaigns,
    {}
);

export default crons;
