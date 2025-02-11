import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/server/services/jwt";

// Use rewrites to get to redirect API
// https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites

interface RouteInfo {
  allowedMethods: {
    [key: string]: {
      isAuthorized: boolean;
    };
  };
}

type RoutesMap = {
  [key: string]: RouteInfo;
};

// Move this routes map to somewhere else (server?)
const routesMap: RoutesMap = {
  "/api/v1/auth/change-password": {
    allowedMethods: {
      POST: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/auth/login": {
    allowedMethods: {
      POST: {
        isAuthorized: false,
      },
    },
  },
  "/api/v1/auth/register": {
    allowedMethods: {
      POST: {
        isAuthorized: false,
      },
    },
  },
  "/api/v1/auth/forgot-password": {
    allowedMethods: {
      POST: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/auth/forgot-password/verify": {
    allowedMethods: {
      POST: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/pets/": {
    allowedMethods: {
      POST: {
        isAuthorized: false,
      },
    },
  },
  "/api/v1/pets/{userId}": {
    allowedMethods: {
      GET: {
        isAuthorized: false,
      },
      PATCH: {
        isAuthorized: true,
      },
      DELETE: {
        isAuthorized: true,
      },
    },
  },
};

export class ReverseProxy {
  // private getRouteInfo(url: string): RouteInfo | null {
  //   // Potential need for regex logic for {userId}
  //   const routeInfo = routesMap[url] ?? null;
  //   return routeInfo
  // }

  private async validateAuthorization(req: NextApiRequest) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Implement
      return null;
    }
    const token = authHeader.split(" ")[1];

    try {
      const userId = verifyToken(token);
      return userId;
    } catch (error) {
      // Implement
      throw error;
    }
  }

  // Client -> Reverse Proxy (index.ts) -> Route Validation -> Auth Check (if required) -> Send to appropriate to Controller -> Handle Response & Errors
  public async handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Check if the request is valid
      const { method, url } = req;
      if (!url || !method)
        return res.status(400).json({ error: "Bad Request" });

      // Check if the route is valid, move to private function
      // Still need to take care of {userId} path, use Regex?
      const routeInfo = routesMap[url];
      if (!routeInfo) return res.status(404).json({ error: "Route Not Found" });

      // Check if given method for route is valid, move to private function
      const authRequirement = routeInfo.allowedMethods[method];
      if (!authRequirement)
        return res.status(405).json({ error: "Method not allowed" });

      // If authorization is required, check:
      if (authRequirement.isAuthorized) {
        const userId = await this.validateAuthorization(req);
        // Should we compare userId to the userId in the route for pets/:userId
        if (!userId) {
          return res.status(403).json({ error: "Forbidden" });
        }
      }

      // Controller logic
      // Pets controller
      // Auth controller
    } catch (error) {
      return res.status(400).json({ error }); // Temporary
    }
  }
}
