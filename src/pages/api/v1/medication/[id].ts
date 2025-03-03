import MedicationService from "@/services/medication";
import { getStatusCode } from "@/types/exceptions";
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

  switch (method) {
    case "GET":
      try {
        const medication = await MedicationService.getMedication(id);
        return res.status(201).json(medication);
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
      }

    case "PATCH":
      try {
        await MedicationService.updateMedication(id, body);
        return res.status(204).end();
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
      }

    case "DELETE":
      try {
        await MedicationService.deleteMedication(id);
        return res.status(204).end();
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
      }

    default:
      // Method not allowed
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
