import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Mount Convex Auth HTTP routes (handles /api/auth/* endpoints)
auth.addHttpRoutes(http);

export default http;
