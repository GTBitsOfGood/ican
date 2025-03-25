import ERRORS from "@/utils/errorMessages";
import dbConnect from "../dbConnect";
import BagItemModel, { BagItem } from "../models/bag";
import { Types } from "mongoose";

export default class BagDAO {
  static async createBagItem(petId: string, itemName: string) {
    await dbConnect();
    try {
      const bagItem: BagItem = { petId: new Types.ObjectId(petId), itemName };
      await BagItemModel.insertOne(bagItem);
    } catch {
      throw new Error(ERRORS.BAG.FAILURE.CREATE);
    }
  }

  static async getBagItemByPetIdAndName(petId: string, itemName: string) {
    await dbConnect();
    const petIdObj = new Types.ObjectId(petId);
    const item = await BagItemModel.findOne({
      petId: petIdObj,
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
