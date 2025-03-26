import { NotFoundError } from "@/types/exceptions";
import UserDAO from "@/db/actions/user";
import ERRORS from "@/utils/errorMessages";
import { validateDeleteUser } from "@/utils/serviceUtils/authServiceUtil";

export default class UserService {
  static async deleteUser(userId: string) {
    validateDeleteUser(userId);

    const user = await UserDAO.getUserFromId(userId);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    await UserDAO.deleteUserFromId(userId);
  }
}
