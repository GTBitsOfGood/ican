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
export const routesMap: RoutesMap = {
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
