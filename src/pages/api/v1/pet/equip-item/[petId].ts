import { validateEquipItem } from "@/services/pets";
import { getStatusCode } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { petId } = req.query;
  const { itemName } = req.body;

  if (req.method !== "PATCH") {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await validateEquipItem(petId as string, itemName);
    res.status(204).end();
  } catch (error) {
    res.status(getStatusCode(error)).json({ error: (error as Error).message });
  }
}
