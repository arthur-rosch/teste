import { User } from "@prisma/client";
import { IEmailToken, IUserRepository } from "@/repository";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { EventEmitter } from "nodemailer/lib/xoauth2";

export class DeleteUser {
  constructor(
    private userRepository: IUserRepository,
    private emailRepository: IEmailToken
  ) {}

  async execute(data: Pick<User, "email">): Promise<void> {
    const { email } = data;

    const userAlreadyExists = await this.userRepository.getUser({ email });

    const emailTokelAlreadyExist = await this.emailRepository.checkEmailToken(email);

    if (emailTokelAlreadyExist) {
      await this.emailRepository.deleteEmailToken(email)
    }

    if (!userAlreadyExists) {
      throw new ErrorHandler(400, "User not exists, try again");
    }
    await this.userRepository.deleteUser({ email });
  }
}
