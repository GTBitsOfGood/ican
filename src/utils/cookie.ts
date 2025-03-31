"use client";
import { NextResponse } from "next/server";

export const generateAPIAuthCookie = (
  nextResponse: NextResponse,
  token: string,
): NextResponse => {
  const expirationDate = generateCookieExpirationTime();

  nextResponse.cookies.set("auth_token", token, {
    httpOnly: true,
    expires: expirationDate,
  });

  return nextResponse;
};

const generateCookieExpirationTime = () => {
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 3);

  return expirationDate;
};
