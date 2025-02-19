import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //   const { petId } = req.query;
  const { method } = req;

  try {
    if (method === "PATCH") {
    } else {
      res.setHeader("Allow", ["PATCH"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
