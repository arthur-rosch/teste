import bcrypt from "bcryptjs";
import Chance from "chance";
import { EmailToken, User } from "@prisma/client";
import { IUserRepository } from "../../../repository";
import { ErrorHandler } from "../../../http/middleware/errorResponse";
import { SendEmailToken } from "../../../service/sendEmail";
import { IEmailToken } from "../../../repository/email";

const chance = new Chance();
interface createUserRequest {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateBirth: string;
  password: string;
  confirmPassword: string;
}

interface createUserResponse {
  user: User;
}

export class CreateUser {
  constructor(
    private userRepository: IUserRepository,
    private emailService: SendEmailToken,
    private emailRepository: IEmailToken
  ) {}

  async execute(data: createUserRequest): Promise<createUserResponse> {
    const { email, password, confirmPassword } = data;

    const userAlreadyExists = await this.userRepository.getUser({
      email,
    });

    if (userAlreadyExists) {
      throw new ErrorHandler(400, "User exists, try again");
    }

    const comparePassword = password === confirmPassword;

    if (!comparePassword) {
      throw new ErrorHandler(400, "Password is not equal");
    }

    const newUser = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dateBirth: data.dateBirth,
      password: await bcrypt.hash(password, 8),
    };

    const token = chance.string({ numeric: true, length: 5 });

    await this.emailService.send(email, token);

    const createdUser = await this.userRepository.create(newUser);

    const saveEmailToken = {
      email,
      token,
      validated: false,
      attempts: 0,
    } as EmailToken;

    await this.emailRepository.create(saveEmailToken);

    return { user: createdUser };
  }
}
