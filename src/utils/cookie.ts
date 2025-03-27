import { UnauthorizedError } from "@/types/exceptions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import ERRORS from "./errorMessages";

export const generateAPIAuthCookie = (
  nextResponse: NextResponse,
  token: string,
): NextResponse => {
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 3);

  nextResponse.cookies.set("auth_token", token, {
    httpOnly: true,
    expires: expirationDate,
  });

  return nextResponse;
};

export const deleteAuthCookie = async (): Promise<void> => {
  (await cookies()).delete("auth_token");
};

export const getAuthCookie = async (): Promise<string> => {
  const authToken = (await cookies()).get("auth_token")?.value;

  if (!authToken) {
    throw new UnauthorizedError(ERRORS.TOKEN.UNAUTHORIZED);
  }

  return authToken;
};
