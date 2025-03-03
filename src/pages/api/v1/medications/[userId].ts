import MedicationService from "@/services/medication";
import { getStatusCode } from "@/types/exceptions";
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

  if (method === "GET") {
    try {
      const medications = await MedicationService.getMedications(userId);
      return res.status(200).json(medications);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(getStatusCode(error)).json({ error: error.message });
      }
    }
  } else {
    // Method not allowed
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
