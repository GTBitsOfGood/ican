import { NextApiRequest, NextApiResponse } from "next";
import { changePassword } from "@/server/service/forgotPasswordCodes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { newPassword, confirmPassword } = req.body;
  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ error: "Authorization header is missing or malformed." });
    }

    const token = authHeader.split(" ")[1];
    await changePassword(token, newPassword, confirmPassword);

    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Unknown error occured." });
  }
}
