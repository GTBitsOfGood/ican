import { routesMap, RouteInfo } from "@/lib/routesMap";
import { validateAuthorization } from "@/services/auth";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/types/exceptions";
import { isHTTPMethod } from "next/dist/server/web/http";
import { NextRequest } from "next/server";

// Checks if given method is in the routesMap, also checks if validation is needed
// However, one thing is that the current implementation allows for any user with a JWT to perform any action
// Including deleting a pet that isn't theirs (not same userId) etc.
export const validateRoutes = async (
  req: NextRequest,
  method: string,
  path: string,
) => {
  if (!path || !method || !isHTTPMethod(method)) {
    throw new BadRequestError("Bad Request");
  }

  // Should we keep a routesMap for every route or only the paths that need to be authenticated?
  // Since we already technically know that the given route is valid because of the HTTP controllers
  const routeInfo: RouteInfo = routesMap[path];

  if (!routeInfo) {
    throw new NotFoundError(`Route not found: ${path}`);
  }

  const methodDetail = routeInfo.allowedMethods[method];
  if (!methodDetail) {
    throw new BadRequestError(`Method not allowed: ${method}`);
  }

  if (methodDetail.isAuthorized) {
    const authHeader = req.headers.get("authorization");
    const auth = await validateAuthorization(authHeader);
    if (!auth) {
      throw new UnauthorizedError("Forbidden");
    }
  }
};
