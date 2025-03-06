import { BagItem } from "@/db/models";
import { validateBagRequest } from "@/services/bag";
import { getStatusCode } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { petId } = req.query;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const items: [BagItem] = await validateBagRequest(petId as string);
    res.status(200).json({ items: items });
  } catch (error) {
    res.status(getStatusCode(error)).json({ error: (error as Error).message });
  }
}
