import { ObjectId } from "mongodb";
import { getUserFromEmail } from "../db/actions/user";

export async function getUserIdFromEmail(
  email: string,
): Promise<ObjectId | undefined> {
  const user = await getUserFromEmail(email);
  return user?._id;
}
