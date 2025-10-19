import UserDAO from "@/db/actions/user";
import { UserDocument } from "@/db/models/user";
import { routesMap } from "@/lib/routesMap";
import { NextRequest } from "next/server";
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
    const tokenUserId: string = JWTService.verifyToken(authToken ?? "").userId;
    const user = await UserDAO.getUserFromId(tokenUserId);

    return user ? user.toObject() : null;
  }

  return null;
};
