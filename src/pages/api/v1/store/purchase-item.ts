// import { validatePurchase } from "@/services/store";
// import { getStatusCode } from "@/types/exceptions";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { petId, itemName } = req.body;

//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     await validatePurchase(petId, itemName);
//     res.status(204).end();
//   } catch (error) {
//     res.status(getStatusCode(error)).json({ error: (error as Error).message });
//   }
// }
