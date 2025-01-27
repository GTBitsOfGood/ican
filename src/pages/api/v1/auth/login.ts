import { LoginBody, validateLogin } from "@/server/service/auth";
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
        const loginBody: LoginBody = body;
        if (
          typeof loginBody.email !== "string" ||
          loginBody.email.trim() === "" ||
          typeof loginBody.password !== "string" ||
          loginBody.password.trim() === ""
        ) {
          return res.status(400).json({
            error:
              "Invalid request body: 'name', 'email', 'password', and 'confirmPassword' are required and must be non-empty strings.",
          });
        }

        const response = await validateLogin(loginBody);

        res.status(200).json(response);
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
