import { Medication } from "@/db/models";
import { getMedications } from "@/services/medication";
import { ApiError } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = req.query;
  const { method } = req;

  if (typeof userId !== "string") {
    return res.status(400).json({ error: "userId must be a string" });
  }

  try {
    if (method === "GET") {
      try {
        const medication: Medication[] | null = await getMedications(userId);
        res.status(200).json(medication);
      } catch (error) {
        if (error instanceof ApiError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          throw error;
        }
      }
    } else {
      // Method not allowed
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
