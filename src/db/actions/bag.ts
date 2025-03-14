import { ObjectId } from "mongodb";
import dbConnect from "../dbConnect";
import BagItemModel, { BagItem } from "../models/bag";

export default class bagDAO {
  static async createBagItem(newItem: BagItem) {
    await dbConnect();
    try {
      await BagItemModel.insertOne(newItem);
    } catch (error) {
      throw new Error("Failed to purchase item: " + (error as Error).message);
    }
  }

  static async getBagItemByPetIdAndName(petId: ObjectId, itemName: string) {
    await dbConnect();
    const item = await BagItemModel.findOne({
      petId: petId,
      itemName: itemName,
    });

    return item;
  }

  static async getPetBag(petId: ObjectId) {
    await dbConnect();
    const items = await BagItemModel.find({ petId });

    return items;
  }
}

// export async function createBagItem(newItem: BagItem) {
//   const db = client.db();

//   try {
//     await db.collection("bagItems").insertOne(newItem);
//   } catch (error) {
//     throw new Error("Failed to purchase item: " + (error as Error).message);
//   }
// }

// export async function getBagItemByPetIdAndName(
//   petId: ObjectId,
//   itemName: string,
// ) {
//   const db = client.db();
//   const item = await db
//     .collection("bagItems")
//     .findOne({ petId: petId, itemName: itemName });

//   return item;
// }

// export async function getPetBag(petId: ObjectId) {
//   const db = client.db();
//   const items = await db.collection("bagItems").find({ petId }).toArray();

//   return items;
// }
