import { ErrorHandler } from "@/http/middleware/errorResponse";
import { IUserRepository } from "@/repository";
import { IEmailToken } from "@/repository/email";
import moment from "moment";

interface validEmailToken {
  email: string;
  token: string;
}

export class ValidEmailToken {
  constructor(
    private emailTokenRepository: IEmailToken,
    private userRepository: IUserRepository
  ) {}

  async execute(data: validEmailToken): Promise<void> {
    const { email, token } = data;

    const emailAlreadyExists = await this.userRepository.getUser({ email });

    if (!emailAlreadyExists) {
      throw new ErrorHandler(400, "Email not exists, try again");
    }

    const validEmailToken =
      await this.emailTokenRepository.checkEmailToken(email);

    if (!validEmailToken) {
      throw new ErrorHandler(400, "Token not exists, try again");
    }

    const tokenDateFormat = moment(validEmailToken.createdAt);

    const currentTime = moment().utc();

    const hoursDiff = Math.abs(currentTime.diff(tokenDateFormat, "hours"));

    if (hoursDiff >= 24) {
      await this.emailTokenRepository.deleteEmailToken(email);

      throw new ErrorHandler(400, "Token has expired, create again");
    }

    if (validEmailToken.attempts === 3) {
      await this.emailTokenRepository.deleteEmailToken(email);

      throw new ErrorHandler(
        400,
        "Number of attempts exceeded, please create a new token"
      );
    }

    const compareToken = token === validEmailToken.token;

    if (!compareToken) {
      await this.emailTokenRepository.updateAttemptsEmailToken({
        email,
        attempts: validEmailToken.attempts + 1,
      });

      throw new ErrorHandler(400, "The Token sent is invalid, try again");
    }

    await this.emailTokenRepository.updateEmailToken({
      email,
      validated: true,
    });
  }
}
