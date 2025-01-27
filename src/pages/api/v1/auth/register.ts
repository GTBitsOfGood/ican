import { CreateUserBody, validateCreateUser } from "@/server/service/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req;

  try {
    switch (method) {
      case "POST":
        // Validate body
        const createBody: CreateUserBody = body;
        if (
          !createBody ||
          typeof createBody.name !== "string" ||
          createBody.name.trim() === "" ||
          typeof createBody.email !== "string" ||
          createBody.email.trim() === "" ||
          typeof createBody.password !== "string" ||
          createBody.name.trim() === "" ||
          typeof createBody.confirmPassword !== "string"
        ) {
          return res.status(400).json({
            error:
              "Invalid request body: 'name', 'email', 'password', and 'confirmPassword' are required and must be non-empty strings.",
          });
        }

        const response = await validateCreateUser(createBody);

        res.status(201).json(response);
        break;

      default:
        // Method not allowed
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
