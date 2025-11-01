import fetchHTTPClient from "./fetchHTTPClient";
import { JWTPayload } from "@/types/jwt";

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
  email?: string;
  userId?: string;
}

export interface VerificationRequestBody {
  userId: string;
  code: string;
  pin?: boolean;
}

export interface ChangePasswordRequestBody {
  password: string;
  confirmPassword: string;
}

export interface AuthResponseBody {
  token: string;
}

export interface GoogleAuthResponseBody {
  userId: string;
  isNewUser?: boolean;
}

export interface ForgotPasswordResponseBody {
  userId: string;
}

export interface ValidateTokenResponseBody {
  isValid: boolean;
  decodedToken: JWTPayload;
}

export default class AuthHTTPClient {
  static async login(
    email: string,
    password: string,
  ): Promise<AuthResponseBody> {
    const loginRequestBody: LoginRequestBody = { email, password };
    return await fetchHTTPClient<AuthResponseBody>(`/auth/login`, {
      method: "POST",
      body: JSON.stringify(loginRequestBody),
      credentials: "include",
    });
  }

  static async logout(): Promise<void> {
    return await fetchHTTPClient(`/auth/logout`, {
      method: "POST",
      body: JSON.stringify({}),
      credentials: "include",
    });
  }

  static async loginWithGoogle(
    userInfo: UserInfo,
  ): Promise<GoogleAuthResponseBody> {
    const loginRequestBody: LoginWithGoogleRequestBody = {
      name: userInfo.name,
      email: userInfo.email,
    };
    return await fetchHTTPClient<GoogleAuthResponseBody>(
      `/auth/login-with-google`,
      {
        method: "POST",
        body: JSON.stringify(loginRequestBody),
        credentials: "include",
      },
    );
  }

  static async register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<AuthResponseBody> {
    const registrationRequestBody: RegistrationRequestBody = {
      name,
      email,
      password,
      confirmPassword,
    };
    return await fetchHTTPClient<AuthResponseBody>(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(registrationRequestBody),
      credentials: "include",
    });
  }

  static async forgotPassword({
    email,
    userId,
  }: {
    email?: string;
    userId?: string;
  }): Promise<ForgotPasswordResponseBody> {
    const forgotPasswordRequestBody: ForgotPasswordRequestBody = {
      email,
      userId,
    };
    return await fetchHTTPClient<ForgotPasswordResponseBody>(
      `/auth/forgot-password`,
      {
        method: "POST",
        body: JSON.stringify(forgotPasswordRequestBody),
        credentials: "include",
      },
    );
  }

  static async verifyForgotPassword(
    userId: string,
    code: string,
    pin?: boolean,
  ): Promise<AuthResponseBody> {
    const verificationRequestBody: VerificationRequestBody = {
      userId,
      code,
      pin,
    };
    return await fetchHTTPClient<AuthResponseBody>(
      `/auth/forgot-password/verify`,
      {
        method: "POST",
        body: JSON.stringify(verificationRequestBody),
        credentials: "include",
      },
    );
  }

  static async changePassword(
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    const changePasswordRequestBody: ChangePasswordRequestBody = {
      password,
      confirmPassword,
    };
    return fetchHTTPClient<void>(`/auth/change-password`, {
      method: "PATCH",
      body: JSON.stringify(changePasswordRequestBody),
      credentials: "include",
    });
  }

  static async validateToken(): Promise<ValidateTokenResponseBody> {
    return await fetchHTTPClient<ValidateTokenResponseBody>(
      `/auth/validate-token`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({}),
      },
    );
  }

  static async getGoogleUserInfo(access_token: string) {
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
  }
}
