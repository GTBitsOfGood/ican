import { ObjectId } from "mongodb";
import client from "../dbClient";
import { InternalServerError } from "@/types/exceptions";
import { BagItem } from "../models";

export async function createBagItem(newItem: BagItem) {
  const db = client.db();

  try {
    await db.collection("bagItems").insertOne(newItem);
  } catch (error) {
    throw new InternalServerError(
      "Failed to purchase item: " + (error as Error).message,
    );
  }
}

export async function getBagItemByPetIdAndName(
  petId: ObjectId,
  itemName: string,
) {
  const db = client.db();
  const item = await db
    .collection("bagItems")
    .findOne({ petId: petId, itemName: itemName });

  return item;
}

export async function getPetBag(petId: ObjectId) {
  const db = client.db();
  const items = await db
    .collection("bagItems")
    .find({ petId: petId })
    .toArray();

  return items;
}
