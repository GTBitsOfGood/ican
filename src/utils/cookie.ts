import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const generateAuthCookie = (
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

export const deleteAuthCookie = async () => {
  (await cookies()).delete("auth_token");
};
