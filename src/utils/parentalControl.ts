import { JWTPayload } from "@/types/jwt";
import { UnauthorizedError } from "@/types/exceptions";
import ERRORS from "@/utils/errorMessages";

export function verifyParentalMode(tokenPayload: JWTPayload): void {
  if (!tokenPayload.parentalControls) {
    return;
  }

  const expiresAt = tokenPayload.parentalModeExpiresAt;

  if (expiresAt === undefined || expiresAt === 0 || Date.now() > expiresAt) {
    throw new UnauthorizedError(ERRORS.SETTINGS.UNAUTHORIZED.PARENTAL_MODE);
  }
}
