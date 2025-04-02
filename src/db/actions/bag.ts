import ERRORS from "@/utils/errorMessages";
import dbConnect from "../dbConnect";
import BagItemModel, { BagItem } from "../models/bag";
import { HydratedDocument, Types } from "mongoose";

export default class BagDAO {
  static async createBagItem(
    petId: string,
    name: string,
    type: string,
  ): Promise<void> {
    await dbConnect();
    try {
      const bagItem: BagItem = { petId: new Types.ObjectId(petId), name, type };
      await BagItemModel.insertOne(bagItem);
    } catch (error) {
      console.log(error);
      throw new Error(ERRORS.BAG.FAILURE.CREATE);
    }
  }

  static async getBagItemByPetIdAndName(
    petId: string,
    name: string,
  ): Promise<HydratedDocument<BagItem>> {
    await dbConnect();
    const petIdObj = new Types.ObjectId(petId);
    const item = await BagItemModel.findOne({
      petId: petIdObj,
      name,
    });

    return item;
  }
  static async getPetBagGroupedByType(petIdString: string) {
    await dbConnect();
    const petId = new Types.ObjectId(petIdString);
    const items = await BagItemModel.aggregate([
      { $match: { petId } },
      { $group: { _id: "$type", items: { $push: "$$ROOT" } } },
    ]);
    return items;
  }
}
