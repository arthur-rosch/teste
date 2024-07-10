import bcrypt from "bcryptjs";
import { ErrorHandler } from "../../../http/middleware/errorResponse";
import { IUserRepository, IEmailToken} from "../../../repository";

interface changePasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export class ChangePassword {
  constructor(
    private userRepository: IUserRepository,
    private emailTokenRepository: IEmailToken
  ) {}

  async execute(data: changePasswordRequest): Promise<void> {
    const { email, password, confirmPassword } = data;

    const emailAlreadyExists = await this.userRepository.getUser({ email });

    if (!emailAlreadyExists) {
      throw new ErrorHandler(400, "Email not exists, try again");
    }

    const validEmailToken =
      await this.emailTokenRepository.checkEmailToken(email);

    if (!validEmailToken) {
      throw new ErrorHandler(400, "Token not exists, try again");
    }

    if (validEmailToken.validated !== true) {
      throw new ErrorHandler(
        400,
        "The Token has not yet been validated, please try again"
      );
    }

    const comparePassword = password === confirmPassword;

    if (!comparePassword) {
      throw new ErrorHandler(400, "Password is not equal");
    }

    await this.userRepository.changePassword({
      email,
      password: await bcrypt.hash(password, 8),
    });

    await this.emailTokenRepository.deleteEmailToken(email);
  }
}
