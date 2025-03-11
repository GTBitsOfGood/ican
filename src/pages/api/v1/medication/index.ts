// import MedicationService from "@/services/medication";
// import { getStatusCode } from "@/types/exceptions";
// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { method, body } = req;

//   if (method == "POST") {
//     try {
//       const id = await MedicationService.createMedication(body);
//       return res.status(201).json({ id });
//     } catch (error) {
//       if (error instanceof Error) {
//         return res.status(getStatusCode(error)).json({ error: error.message });
//       }
//     }
//   } else {
//     // Method not allowed
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).json({ error: `Method ${method} Not Allowed` });
//   }
// }
