export interface RouteInfo {
  allowedMethods: {
    [key in string]?: {
      isAuthorized: boolean;
    };
  };
}

type RoutesMap = {
  [key: string]: RouteInfo;
};

export const routesMap: RoutesMap = {
  "/api/v1/auth/change-password": {
    allowedMethods: {
      PATCH: {
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
        isAuthorized: false,
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
  "/api/v1/auth/logout": {
    allowedMethods: {
      POST: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/user/[userId]": {
    allowedMethods: {
      DELETE: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/pets": {
    allowedMethods: {
      POST: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/pets/[userId]": {
    allowedMethods: {
      GET: {
        isAuthorized: true,
      },
      PATCH: {
        isAuthorized: true,
      },
      DELETE: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/medication/[medicationId]/log": {
    allowedMethods: {
      POST: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/medication/[medicationId]/check-in": {
    allowedMethods: {
      POST: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/pet/[petId]/feed": {
    allowedMethods: {
      PATCH: {
        isAuthorized: true,
      },
    },
  },
};
