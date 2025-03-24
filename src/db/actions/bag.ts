import dbConnect from "../dbConnect";
import BagItemModel, { BagItem } from "../models/bag";
import { Types } from "mongoose";

export default class BagDAO {
  static async createBagItem(petId: string, itemName: string) {
    await dbConnect();
    try {
      const bagItem: BagItem = { petId: new Types.ObjectId(petId), itemName };
      await BagItemModel.insertOne(bagItem);
    } catch (error) {
      throw new Error("Failed to purchase item: " + (error as Error).message);
    }
  }

  static async getBagItemByPetIdAndName(petIdString: string, itemName: string) {
    await dbConnect();
    const petId = new Types.ObjectId(petIdString);
    const item = await BagItemModel.findOne({
      petId,
      itemName,
    });

    return item;
  }

  static async getPetBag(petIdString: string) {
    await dbConnect();
    const petId = new Types.ObjectId(petIdString);
    const items = await BagItemModel.find({ petId });

    return items;
  }
}
