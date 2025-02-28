import UserDAO from "@/db/actions/user";
import { routesMap } from "@/lib/routesMap";
import JWTService from "@/services/jwt";
import { UnauthorizedError } from "@/types/exceptions";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

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
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Authentication token is missing or malformed",
      );
    }

    const token = authHeader.substring(7);
    const tokenUserId: string = JWTService.verifyToken(token).userId; // Any expired token's error should propogate from here
    await UserDAO.getUserFromId(new ObjectId(tokenUserId)); // Verify if user actually exists
    return tokenUserId; // Would this be better as an ObjectId or String?
  }
};
