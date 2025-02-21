import { NextApiRequest, NextApiResponse } from "next";
import { forgotPasswordService } from "@/services/forgotPasswordCodes";
import { ApiError } from "@/types/exceptions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { password, confirmPassword } = req.body;

  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ error: "Authorization header is missing or malformed." });
    }

    const token = authHeader.split(" ")[1];
    await forgotPasswordService.changePassword(
      token,
      password,
      confirmPassword,
    );

    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Unknown error occured." });
  }
}
