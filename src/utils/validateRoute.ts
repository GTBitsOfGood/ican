import UserDAO from "@/db/actions/user";
import { UserDocument } from "@/db/models/user";
import { routesMap } from "@/lib/routesMap";
import JWTService from "@/services/jwt";
import { UnauthorizedError } from "@/types/exceptions";
import { NextRequest } from "next/server";

export const validateRoutes = async (
  req: NextRequest,
  method: string,
  path: string,
): Promise<UserDocument | null> => {
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
    const tokenUserId: string = JWTService.verifyToken(token).userId;
    const user = await UserDAO.getUserFromId(tokenUserId);

    return user ? user.toObject() : null;
  }

  return null;
};
