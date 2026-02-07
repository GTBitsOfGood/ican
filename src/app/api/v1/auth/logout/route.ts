import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { withAuth } from "@/utils/withAuth";

export const POST = withAuth<Record<string, never>>(async () => {
  (await cookies()).delete("auth_token");
  return new NextResponse(null, { status: 204 });
});
