import { Medication } from "@/db/models/medication";
import MedicationService from "@/services/medication";
import { getStatusCode } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { medicationId } = req.query;
  const { method, body } = req;

  if (typeof medicationId !== "string") {
    return res.status(400).json({ error: "medicationId must be a string" });
  }

  switch (method) {
    case "GET":
      try {
        const medication: Medication | null =
          await MedicationService.getMedication(medicationId);
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
        await MedicationService.updateMedication(medicationId, body);
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
        await MedicationService.deleteMedication(medicationId);
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
