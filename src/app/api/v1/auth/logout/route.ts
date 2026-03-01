import { withoutAuth } from "@/utils/withAuth";
import { NextResponse } from "next/server";

export const POST = withoutAuth<Record<string, never>>(async () => {
  const response = new NextResponse(null, { status: 204 });

  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  return response;
});
