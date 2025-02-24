import { getUserFromId } from "@/db/actions/user";
import { routesMap } from "@/lib/routesMap";
import { verifyToken } from "@/services/jwt";
import { NotFoundError, UnauthorizedError } from "@/types/exceptions";
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
    throw new NotFoundError(`Route not found inside route map: ${path}`);
  }

  if (authRequired) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      // null or doesn't start with "Bearer "
      throw new UnauthorizedError(
        "Authentication token is missing or malformed",
      );
    }

    const token = authHeader.split(" ")[1];
    const tokenUserId: string = verifyToken(token).userId; // Any expired token's error should propogate from here
    const user = await getUserFromId(new ObjectId(tokenUserId));
    if (!user) {
      throw new UnauthorizedError("Token signature is invalid");
    }

    return user; // Return user if needed
  }
};
