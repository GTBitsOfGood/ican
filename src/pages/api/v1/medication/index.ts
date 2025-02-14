import { createMedication } from "@/services/medication";
import { ApiError } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req;

  try {
    if (method == "POST") {
      try {
        const createdMedication = await createMedication({
          formOfMedication: body?.formOfMedication,
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
        res.status(200).json(createdMedication);
      } catch (error) {
        if (error instanceof ApiError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          throw error;
        }
      }
    } else {
      // Method not allowed
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
