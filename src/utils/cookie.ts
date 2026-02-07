"use server";
import { NextResponse } from "next/server";

export const generateAPIAuthCookie = async (
  nextResponse: NextResponse<unknown>,
  token: string,
  rememberMe: boolean = false,
): Promise<NextResponse<unknown>> => {
  const expirationDate = generateCookieExpirationTime(rememberMe);
  const isProduction = process.env.NODE_ENV === "production";

  nextResponse.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: isProduction,
    expires: expirationDate,
  });

  return nextResponse;
};

const generateCookieExpirationTime = (rememberMe: boolean = false) => {
  const expirationDate = new Date();

  if (rememberMe) {
    expirationDate.setDate(expirationDate.getDate() + 7);
  } else {
    expirationDate.setHours(expirationDate.getHours() + 3);
  }
  return expirationDate;
};
