import { ObjectId } from "mongodb";
import { getUserFromEmail } from "../db/actions/user";
import { BadRequestError, NotFoundError } from "@/utils/errors";

export async function getUserIdFromEmail(
  email: string | undefined,
): Promise<ObjectId> {
  if (!email) {
    throw new BadRequestError("Invalid Email.");
  }
  const user = await getUserFromEmail(email);
  if (!user?._id) {
    throw new NotFoundError("User not found.");
  }
  return user?._id;
}
