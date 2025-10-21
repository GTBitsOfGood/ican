export type JWTOrigin = "login" | "forgot-password";

export interface JWTPayload {
  userId: string;
  parentalControls: boolean;
  parentalModeExpiresAt?: number;
  origin: JWTOrigin;
}
