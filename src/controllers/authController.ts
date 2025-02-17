import { NextApiRequest, NextApiResponse } from "next";
import { validateCreateUser, validateLogin } from "../services/auth";
import {
  changePassword,
  sendPasswordCode,
  verifyForgotPasswordCode,
} from "../server/services/forgotPasswordCodes";

export class authController {
  public static async login(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    const response = await validateLogin(email, password);
    return res.status(201).json(response);
  }

  public static async register(req: NextApiRequest, res: NextApiResponse) {
    const { name, email, password, confirmPassword } = req.body;
    const response = await validateCreateUser(
      name,
      email,
      password,
      confirmPassword,
    );
    return res.status(201).json(response);
  }

  public static async forgotPassword(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const { email } = req.body;
    const userId = await sendPasswordCode(email);
    return res.status(200).json({ userId });
  }

  public static async changePassword(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const { password, confirmPassword } = req.body;
    // This shouldn't ever be null because we check it in the reverse proxy, will test.
    const token = req.headers.authorization?.split(" ")[1];

    // Temporary because can't assert non-null
    if (!token) {
      throw new Error("No token provided");
    }

    await changePassword(token, password, confirmPassword);
    return res.status(200).json({ message: "Password updated sucessfully!" });
  }

  public static async verifyPassword(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const { userId, code } = req.body;
    const token = await verifyForgotPasswordCode(userId, code);
    return res.status(200).json({ token });
  }
}
