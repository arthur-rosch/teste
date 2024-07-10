import { ErrorHandler } from "../../../http/middleware/errorResponse";
import { IUserRepository, IEmailToken } from "../../../repository";
import { SendEmailToken } from "../../../service/sendEmail";
import { EmailToken } from "@prisma/client";
import Chance from "chance";

const chance = new Chance();

export class SendEmailTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private sendEmailTokeService: SendEmailToken,
    private emailTokenRepository: IEmailToken
  ) {}

  async execute(email: string): Promise<void> {
    const userAlreadyExists = await this.userRepository.getUser({ email });

    if (!userAlreadyExists) {
      throw new ErrorHandler(400, "User not exists, try again");
    }

    const validEmailToken =
      await this.emailTokenRepository.checkEmailToken(email);

    if (validEmailToken) {
      await this.emailTokenRepository.deleteEmailToken(email);
    }

    const token = chance.string({ numeric: true, length: 5 });

    await this.sendEmailTokeService.send(email, token);

    const saveEmailToken = {
      email,
      token,
      validated: false,
      attempts: 0,
    } as EmailToken;

    await this.emailTokenRepository.create(saveEmailToken);
  }
}
