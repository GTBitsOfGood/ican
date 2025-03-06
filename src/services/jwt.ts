import { UnauthorizedError } from "@/types/exceptions";
import {
  validateDecodeGoogleToken,
  validateGenerateToken,
  validateVerifyToken,
} from "@/utils/serviceUtils/jwtUtil";
import ERRORS from "@/utils/errorMessages";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
}

const JWT_SECRET = process.env.JWT_SECRET;

export default class JWTService {
  static generateToken(
    payload: Record<string, unknown>,
    expiresIn: number,
  ): string {
    validateGenerateToken({ payload, expiresIn });
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  }

  static verifyToken(token: string): { userId: string } {
    try {
      validateVerifyToken({ token });
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError(ERRORS.JWT.UNAUTHORIZED);
      } else {
        throw new Error();
      }
    }
  }

  static decodeGoogleToken(credential: string) {
    try {
      validateDecodeGoogleToken({ credential });
      const decoded = jwt.decode(credential);
      return decoded;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError(ERRORS.JWT.UNAUTHORIZED);
      } else {
        throw new Error();
      }
    }
  }
}
