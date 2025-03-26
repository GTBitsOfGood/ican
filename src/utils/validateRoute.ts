import UserDAO from "@/db/actions/user";
import { routesMap } from "@/lib/routesMap";
import JWTService from "@/services/jwt";
import { UnauthorizedError } from "@/types/exceptions";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import ERRORS from "./errorMessages";

// Checks if given method is in the routesMap, also checks if validation is needed
// However, one thing is that the current implementation allows for any user with a JWT to perform any action
// Including deleting a pet that isn't theirs (not same userId) etc.
export const validateRoutes = async (
  req: NextRequest,
  method: string,
  path: string,
) => {
  const authRequired = routesMap[path]?.allowedMethods?.[method]?.isAuthorized;

  if (authRequired == null) {
    throw new Error(`Route not found inside route map: ${path}`);
  }

  if (authRequired) {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) {
      throw new UnauthorizedError(ERRORS.TOKEN.UNAUTHORIZED);
    }

    const tokenUserId: string = JWTService.verifyToken(token).userId; // Any expired token's error should propogate from here
    await UserDAO.getUserFromId(new ObjectId(tokenUserId)); // Verify if user actually exists
    return tokenUserId; // Currently defaults to returning the string, but can be changed to return the actual UserObject
  }
};
