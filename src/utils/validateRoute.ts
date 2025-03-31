import UserDAO from "@/db/actions/user";
import { UserDocument } from "@/db/models/user";
import { routesMap } from "@/lib/routesMap";
import { UnauthorizedError } from "@/types/exceptions";
import { NextRequest } from "next/server";
import ERRORS from "./errorMessages";
import JWTService from "@/services/jwt";

export const validateRoutes = async (
  req: NextRequest,
  method: string,
  path: string,
  authToken?: string,
): Promise<UserDocument | null> => {
  const authRequired = routesMap[path]?.allowedMethods?.[method]?.isAuthorized;

  if (authRequired == null) {
    throw new Error(`Route not found inside route map: ${path}`);
  }

  if (authRequired) {
    if (!authToken) {
      throw new UnauthorizedError(ERRORS.TOKEN.UNAUTHORIZED);
    }
    const tokenUserId: string = JWTService.verifyToken(authToken).userId;
    const user = await UserDAO.getUserFromId(tokenUserId);

    return user ? user.toObject() : null;
  }

  return null;
};
