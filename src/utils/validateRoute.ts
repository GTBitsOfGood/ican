import { routesMap } from "@/lib/routesMap";
import { UnauthorizedError } from "@/types/exceptions";
import { NextRequest } from "next/server";
import ERRORS from "./errorMessages";
import JWTService from "@/services/jwt";

// Checks if given method is in the routesMap, also checks if validation is needed
// However, one thing is that the current implementation allows for any user with a JWT to perform any action
// Including deleting a pet that isn't theirs (not same userId) etc.
export const validateRoutes = async (
  req: NextRequest,
  method: string,
  path: string,
  authToken?: string,
) => {
  const authRequired = routesMap[path]?.allowedMethods?.[method]?.isAuthorized;

  if (authRequired == null) {
    throw new Error(`Route not found inside route map: ${path}`);
  }

  if (authRequired) {
    if (!authToken) {
      throw new UnauthorizedError(ERRORS.TOKEN.UNAUTHORIZED);
    }
    const decodedToken = JWTService.verifyToken(authToken);
    return decodedToken.userId;
  }
};
