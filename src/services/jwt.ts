import { UnauthorizedError } from "@/types/exceptions";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
}

const JWT_SECRET = process.env.JWT_SECRET;

const JWTService = {
  generateToken(payload: Record<string, unknown>, expiresIn: number): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  },

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError("Invalid or expired token.");
      } else {
        throw new Error("An unknown error occurred.");
      }
    }
  },

  decodeGoogleToken(credential: string) {
    try {
      const decoded = jwt.decode(credential);
      return decoded;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError("Invalid or expired token.");
      } else {
        throw new Error("An unknown error occurred.");
      }
    }
  },
};

export default JWTService;
