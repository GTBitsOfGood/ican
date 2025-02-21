import { Medication } from "@/db/models";
import { medicationService } from "@/services/medication";
import { AppError, getStatusCode } from "@/types/exceptions";
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
        const medication: Medication | null =
          await medicationService.getMedication(id);
        return res.status(201).json(medication);
      } catch (error) {
        if (error instanceof AppError) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
        return res.status(500).json({ error: (error as Error).message });
      }

    case "PATCH":
      try {
        await medicationService.updateMedication(id, body);
        return res.status(204).end();
      } catch (error) {
        if (error instanceof AppError) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
        return res.status(500).json({ error: (error as Error).message });
      }

    case "DELETE":
      try {
        await medicationService.deleteMedication(id);
        return res.status(204).end();
      } catch (error) {
        if (error instanceof AppError) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
        return res.status(500).json({ error: (error as Error).message });
      }

    default:
      // Method not allowed
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
