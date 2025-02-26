import { createMedicationLog } from "@/services/medication";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  const { method, body } = req;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "id must be a string" });
  }

  try {
    if (method === "POST") {
      await createMedicationLog(id, body?.pin);
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
