import { z } from "zod";
import { tokenSchema } from "./commonSchemaUtil";

export const generateTokenSchema = z.object({
  payload: z.record(z.string(), z.unknown()),
  expiresIn: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+\s*(ms|s|m|h|d|w|y)$/, {
      message: "String should be a valid time ('60s', '2h', '7d')",
    }),
  ]),
});
export const verifyTokenSchema = z.object({ token: tokenSchema });

export const decodeGoogleTokenSchema = z.object({ credential: tokenSchema });

export type GenerateTokenInput = z.infer<typeof generateTokenSchema>;
export type VerifyTokenInput = z.infer<typeof verifyTokenSchema>;
export type DecodeGoogleTokenInput = z.infer<typeof decodeGoogleTokenSchema>;

export const validateGenerateToken = (data: unknown): GenerateTokenInput => {
  return generateTokenSchema.parse(data);
};

export const validateVerifyToken = (data: unknown): VerifyTokenInput => {
  return verifyTokenSchema.parse(data);
};

export const validateDecodeGoogleToken = (
  data: unknown,
): DecodeGoogleTokenInput => {
  return decodeGoogleTokenSchema.parse(data);
};
