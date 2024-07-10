import { IUserRepository } from "../../../repository";
import { ErrorHandler } from "../../../http/middleware/errorResponse";

export class GetUser {
  constructor(private userRepository: IUserRepository) {}

  async execute() {
    const users = await this.userRepository.getAllUsers();

    if (!users) {
      throw new ErrorHandler(400, "Not registered users");
    }

    const returnUsers = users.map(({ id, name, email }) => ({
      id,
      name,
      email,
    }));

    return returnUsers;
  }
}
