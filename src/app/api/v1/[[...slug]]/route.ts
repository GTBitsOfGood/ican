import { NotFoundError } from "@/types/exceptions";
import { handleError } from "@/utils/errorHandler";
import { NextRequest } from "next/server";

// This isn't needed at all, but just replaces the 404 page with a JSON response containing "Route not found: nextUrl"
// Can definitely just be deleted if we want NextJS to just show a 404 page instead

export async function GET(req: NextRequest) {
  try {
    throw new NotFoundError(`Route not found: ${req.nextUrl}`);
  } catch (error) {
    return handleError(error);
  }
}

export { GET as POST, GET as PUT, GET as DELETE, GET as PATCH };
