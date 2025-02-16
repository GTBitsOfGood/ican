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

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponseBody> => {
    const loginReqquestBody: LoginRequestBody = { email, password };
    return fetchService<AuthResponseBody>(`/auth/login`, {
      method: "POST",
      body: JSON.stringify(loginReqquestBody),
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

    return fetchService<AuthResponseBody>(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(registrationRequestBody),
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    const forgotPasswordRequestBody: ForgotPasswordRequestBody = { email };
    return fetchService<void>(`/auth/forget-password`, {
      method: "POST",
      body: JSON.stringify(forgotPasswordRequestBody),
    });
  },

  verifyForgotPassword: async (userId: string, code: string): Promise<void> => {
    const verificationRequestBody: VerificationRequestBody = { userId, code };
    return fetchService<void>(`/auth/verify`, {
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
    return fetchService<void>(`/auth/change-password`, {
      method: "POST",
      body: JSON.stringify(changePasswordRequestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};
