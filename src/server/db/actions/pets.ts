import client from "../dbClient";

export async function getPetByUserId(id: number) {
  const db = client.db();
  const pet = await db.collection("pets").findOne({ userId: id });

  return pet;
}

export async function updatePetName(id: number, name: string) {
  const db = client.db();
  const updatedPet = await db
    .collection("pets")
    .findOneAndUpdate(
      { userId: id },
      { $set: { name: name } },
      { returnDocument: "after" },
    );

  return updatedPet;
}
