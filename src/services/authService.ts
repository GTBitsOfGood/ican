import { fetchAPI } from "@/services/fetchAPI";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerificationData {
  userId: number;
  code: string;
}

export interface PasswordChange {
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
}

export const authService = {
  // I'm assuming login and registration returns a JWT token? I wasn't sure which method it was referring to.
  login: async (loginData: LoginData): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  },

  register: async (registrationData: RegistrationData): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>(`/auth/register`, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    return fetchAPI<void>(`/auth/forget-password`, {
      method: 'POST',
      body: JSON.stringify({email}),
    });
  },

  verifyForgotPassword: async (verificationData: VerificationData): Promise<void> => {
    return fetchAPI<void>(`/auth/verify`, {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  },

  changePassword: async (passwordChange: PasswordChange): Promise<void> => {
    return fetchAPI<void>(`/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify(passwordChange),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  },
}