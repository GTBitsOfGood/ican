import { z } from "zod";
import { emailSchema } from "./commonSchemaUtil";

export const sendEmailSchema = z.object({
  to: emailSchema,

  subject: z.string().trim().nonempty(),

  html: z.string().trim().nonempty(),
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;

export const validateSendEmail = (data: unknown): SendEmailInput => {
  return sendEmailSchema.parse(data);
};
