import fetchService from "./fetchService";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginWithGoogleRequestBody {
  name: string;
  email: string;
}

interface UserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export interface RegistrationRequestBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequestBody {
  email: string;
}

export interface VerificationRequestBody {
  userId: string;
  code: string;
}

export interface ChangePasswordRequestBody {
  password: string;
  confirmPassword: string;
}

export interface AuthResponseBody {
  token: string;
}

export interface ForgotPasswordResponseBody {
  userId: string;
}

export interface ValidateTokenResponseBody {
  isValid: boolean;
  decodedToken: { userId: string };
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponseBody> => {
    const loginRequestBody: LoginRequestBody = { email, password };
    return await fetchService<AuthResponseBody>(`/auth/login`, {
      method: "POST",
      body: JSON.stringify(loginRequestBody),
    });
  },

  loginWithGoogle: async (userInfo: UserInfo): Promise<AuthResponseBody> => {
    const loginRequestBody: LoginWithGoogleRequestBody = {
      name: userInfo.name,
      email: userInfo.email,
    };
    return await fetchService<AuthResponseBody>(`/auth/login-with-google`, {
      method: "POST",
      body: JSON.stringify(loginRequestBody),
    });
  },

  register: async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<AuthResponseBody> => {
    const registrationRequestBody: RegistrationRequestBody = {
      name,
      email,
      password,
      confirmPassword,
    };
    return await fetchService<AuthResponseBody>(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(registrationRequestBody),
    });
  },

  forgotPassword: async (
    email: string,
  ): Promise<ForgotPasswordResponseBody> => {
    const forgotPasswordRequestBody: ForgotPasswordRequestBody = { email };
    return await fetchService<ForgotPasswordResponseBody>(
      `/auth/forgot-password`,
      {
        method: "POST",
        body: JSON.stringify(forgotPasswordRequestBody),
      },
    );
  },

  verifyForgotPassword: async (
    userId: string,
    code: string,
  ): Promise<AuthResponseBody> => {
    const verificationRequestBody: VerificationRequestBody = { userId, code };
    return await fetchService<AuthResponseBody>(
      `/auth/forgot-password/verify`,
      {
        method: "POST",
        body: JSON.stringify(verificationRequestBody),
      },
    );
  },

  changePassword: async (
    password: string,
    confirmPassword: string,
  ): Promise<void> => {
    const changePasswordRequestBody: ChangePasswordRequestBody = {
      password,
      confirmPassword,
    };
    return fetchService<void>(`/auth/change-password`, {
      method: "PATCH",
      body: JSON.stringify(changePasswordRequestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  validateToken: async (): Promise<ValidateTokenResponseBody> => {
    return await fetchService<ValidateTokenResponseBody>(
      `/auth/validate-token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({}),
      },
    );
  },

  getGoogleUserInfo: async (access_token: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      return await response.json();
    } catch (error) {
      console.error("Google Login Failed: " + (error as Error).message);
    }
  },
};
