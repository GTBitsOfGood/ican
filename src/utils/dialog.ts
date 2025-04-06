import UserDAO from "@/db/actions/user";

const generateDialog = async (userId: string) => {
  const user = await UserDAO.getUserFromId(userId);
  return Object.freeze({
    FEEDING: {
      QUESTION: "I'm hungry, can you please feed me some food?",
      AFFIRMATION: `Great job taking your medication ${user?.name}!`,
      PROMPT: `Drag and drop the food onto ${user?.name}'s Pet.`,
      THANKS: `Yummy! Thanks for feeding me, ${user?.name}!`,
    },
  });
};

export default generateDialog;
