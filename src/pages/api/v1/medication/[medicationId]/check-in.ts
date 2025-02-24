import { createMedicationCheckIn } from "@/services/medication";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { medicationId } = req.query;
  const { method } = req;

  if (typeof medicationId !== "string") {
    return res.status(400).json({ error: "id must be a string" });
  }

  try {
    if (method === "POST") {
      await createMedicationCheckIn(medicationId);
      res.status(204).end();
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
