import { z } from "zod";
import { tokenSchema } from "./commonSchemaUtil";

export const generateTokenSchema = z.object({
  payload: z.record(z.string(), z.unknown()),

  expiresIn: z.number().int().positive(),
});

export const verifyTokenSchema = tokenSchema;

export const decodeGoogleTokenSchema = tokenSchema;

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
