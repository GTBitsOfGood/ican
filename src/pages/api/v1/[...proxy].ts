import type { NextApiRequest, NextApiResponse } from "next";
import { validateAuthorization } from "@/server/services/auth";
import { routesMap, RouteInfo } from "@/server/routesMap";
import { petsController, authController } from "@/server/controllers";
import {
  AlreadyExistsError,
  BadRequestError,
  DoesNotExistError,
  InvalidBodyError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  InternalServerError,
  MethodNotAllowedError,
} from "@/types/exceptions";

/**
 * Reverse proxy intercepts all API calls and validates path, method, and authorization before sending the call to the appropriate controller
 */
export class ReverseProxy {
  // Client -> Reverse Proxy (index.ts) -> Route Validation -> Auth Check (if required) -> Send to appropriate to Controller -> Handle Response & Errors
  public async handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Using a catch-all because rewrites did not work in my testing, additionally both present the challenge of matching dynamic URLs
      const { method, query } = req;
      const { proxy } = query;

      if (!proxy) {
        throw new BadRequestError("Bad Request");
      }

      let path = `/api/v1/${(proxy as string[]).join("/")}`;

      if (!path || !method) {
        throw new BadRequestError("Bad Request");
      }

      let userId: string = "";

      // Not sure how to check for dynamic userId url, as in whether to:
      // regex and for loop through all paths, or to make a radix tree (or get a npm module that does that)
      // But currently its hard coded.
      if (proxy.length == 2 && path.startsWith("/api/v1/pets/")) {
        path = "/api/v1/pets/{userId}";
        userId = proxy[2];
      }

      const routeInfo: RouteInfo = routesMap[path];
      if (!routeInfo) {
        throw new NotFoundError("Route Not Found");
      }

      // Check if method is allowed
      const methodDetail = routeInfo.allowedMethods[method];
      if (!methodDetail) {
        throw new BadRequestError("Method not allowed");
      }

      // If authorization is required, check:
      if (methodDetail.isAuthorized) {
        const authHeader = req.headers.authorization;
        if (
          !authHeader ||
          !authHeader.startsWith("Bearer ") ||
          !validateAuthorization(authHeader, userId)
        ) {
          throw new UnauthorizedError("Forbidden");
        }
      }

      // Route based on path
      switch (path) {
        case "/api/v1/auth/change-password":
          return await authController.changePassword(req, res);

        case "/api/v1/auth/login":
          return await authController.login(req, res);

        case "/api/v1/auth/register":
          return await authController.register(req, res);

        case "/api/v1/auth/forgot-password":
          return await authController.forgotPassword(req, res);

        case "/api/v1/auth/forgot-password/verify":
          return await authController.verifyPassword(req, res);

        case "/api/v1/pets/":
          return await petsController.createPet(req, res);

        case "/api/v1/pets/{userId}":
          switch (method) {
            case "GET":
              return await petsController.getPet(req, res, userId);
            case "PATCH":
              return await petsController.updatePet(req, res, userId);
            case "DELETE":
              return await petsController.deletePet(req, res, userId);
            default:
              throw new BadRequestError("Method not allowed");
          }

        default:
          throw new NotFoundError("Route not found");
      }
    } catch (error) {
      if (error instanceof AlreadyExistsError) {
        return res.status(409).json({ error: error.message });
      } else if (error instanceof DoesNotExistError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof InvalidBodyError) {
        return res.status(400).json({ error: error.message });
      } else if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof BadRequestError) {
        return res.status(400).json({ error: error.message });
      } else if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      } else if (error instanceof ConflictError) {
        return res.status(409).json({ error: error.message });
      } else if (error instanceof InternalServerError) {
        return res.status(500).json({ error: error.message });
      } else if (error instanceof MethodNotAllowedError) {
        return res.status(405).json({ error: error.message });
      } else {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
