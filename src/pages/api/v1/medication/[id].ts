import { Medication } from "@/db/models";
import {
  deleteMedication,
  getMedication,
  updateMedication,
} from "@/services/medication";
import { ApiError, getStatusCode } from "@/types/exceptions";
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
    switch (method) {
      case "GET":
        try {
          const medication: Medication | null = await getMedication(id);
          res.status(201).json(medication);
        } catch (error) {
          if (error instanceof ApiError) {
            res.status(getStatusCode(error)).json({ error: error.message });
          } else {
            throw error;
          }
        }

        break;

      case "PATCH":
        try {
          await updateMedication(id, {
            formOfMedication: body.formOfMedication,
            medicationId: body.medicationId,
            repeatInterval: body.repeatInterval,
            repeatUnit: body.repeatUnit,
            repeatOn: body.repeatOn,
            repeatMonthlyOnDay: body.repeatMonthlyOnDay,
            notificationFrequency: body.notificationFrequency,
            dosesPerDay: body.dosesPerDay,
            doseIntervalInHours: body.doseIntervalInHours,
            doseTimes: body.doseTimes,
          });
          res.status(204).end();
        } catch (error) {
          if (error instanceof ApiError) {
            res.status(getStatusCode(error)).json({ error: error.message });
          } else {
            throw error;
          }
        }

        break;

      case "DELETE":
        try {
          await deleteMedication(id);
          res.status(204).end();
        } catch (error) {
          if (error instanceof ApiError) {
            res.status(getStatusCode(error)).json({ error: error.message });
          } else {
            throw error;
          }
        }

        break;

      default:
        // Method not allowed
        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
