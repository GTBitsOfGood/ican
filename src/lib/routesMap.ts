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
  "/api/v1/auth/login-with-google": {
    allowedMethods: {
      POST: {
        isAuthorized: false,
      },
    },
  },
  "/api/v1/auth/validate-token": {
    allowedMethods: {
      POST: {
        isAuthorized: true,
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
        isAuthorized: false,
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
  "/api/v1/user/[userId]/onboarding-status": {
    allowedMethods: {
      GET: {
        isAuthorized: true,
      },
      PUT: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/user/[userId]/tutorial-status": {
    allowedMethods: {
      GET: {
        isAuthorized: true,
      },
      PUT: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/user/[userId]/profile": {
    allowedMethods: {
      GET: {
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
  "/api/v1/medication": {
    allowedMethods: {
      POST: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/medication/[medicationId]": {
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
  "/api/v1/medications/[userId]": {
    allowedMethods: {
      GET: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/medications/[userId]/schedule": {
    allowedMethods: {
      GET: {
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
  "/api/v1/store/purchase-item": {
    allowedMethods: {
      POST: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/settings/[userId]": {
    allowedMethods: {
      GET: {
        isAuthorized: true,
      },
      PATCH: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/settings/pin/[userId]": {
    allowedMethods: {
      PATCH: {
        isAuthorized: true,
      },
      POST: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/pet/[petId]/equip-item": {
    allowedMethods: {
      PATCH: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/pet/[petId]/unequip-item": {
    allowedMethods: {
      PATCH: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/pet/[petId]/equip-outfit": {
    allowedMethods: {
      PATCH: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/pet/[petId]/outfit/[name]": {
    allowedMethods: {
      DELETE: {
        isAuthorized: true,
      },
      POST: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/bag/[petId]": {
    allowedMethods: {
      GET: {
        isAuthorized: true,
      },
    },
  },
  "/api/v1/bag/[petId]/foods": {
    allowedMethods: {
      GET: {
        isAuthorized: true,
      },
    },
  },
};
