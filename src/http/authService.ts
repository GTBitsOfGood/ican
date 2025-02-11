import fetchService from "./fetchService";

export interface LoginRequestBody {
  email: string;
  password: string;
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
    return await fetchService<AuthResponseBody>(`/auth/verify`, {
      method: "POST",
      body: JSON.stringify(verificationRequestBody),
    });
  },

  changePassword: async (
    password: string,
    confirmPassword: string,
  ): Promise<void> => {
    const changePasswordRequestBody: ChangePasswordRequestBody = {
      password,
      confirmPassword,
    };
    return await fetchService<void>(`/auth/change-password`, {
      method: "POST",
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
};
