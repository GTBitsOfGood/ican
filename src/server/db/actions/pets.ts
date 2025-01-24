import client from "../dbClient";

export async function getPetsByUserId(id: number) {
  const db = client.db("ican");
  const collection = db.collection("pets");

  //Retrieve user's one pet
  return collection.findOne({ userId: id });
}
