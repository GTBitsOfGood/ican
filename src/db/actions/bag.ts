import { ObjectId } from "mongodb";
import client from "../dbClient";
import { InternalServerError } from "@/types/exceptions";
import { BagItem } from "../models";
import { updatePetCoinsByPetId } from "./pets";

export async function purchaseItem(newItem: BagItem, newBalance: number) {
  const db = client.db();

  try {
    await db.collection("bagItems").insertOne(newItem);
    await updatePetCoinsByPetId(newItem.petId, newBalance);
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
