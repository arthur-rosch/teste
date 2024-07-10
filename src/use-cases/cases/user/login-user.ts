import bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { IEmailToken, IUserRepository } from '@/repository'
import { ErrorHandler } from '../../../http/middleware/errorResponse'
import { User } from '@prisma/client'

interface LoginUserRequest {
  email: string
  password: string
}

interface LoginUserResponse {
  user: User
  token: string
}

export class LoginUser {
  constructor(
    private userRepository: IUserRepository,
    private emailRepository: IEmailToken
  ) {}

  async execute(data: LoginUserRequest): Promise<LoginUserResponse> {
    const { email, password } = data;

    const userAlreadyExists = await this.userRepository.getUser({ email });

    if (!userAlreadyExists) {
      throw new ErrorHandler(400, "User not exists, try again");
    }

    const tokenAlreadyValid = await this.emailRepository.checkEmailToken(email)

    if (!tokenAlreadyValid?.validated) {
      throw new ErrorHandler(400, "You need to validate your email to log in")
    }

    const passwordMatch = await bcrypt.compare(
      password as string,
      userAlreadyExists.password
    );

    if (!passwordMatch) {
      throw new ErrorHandler(400, "Password is not equal");
    }

    const secrectKey = process.env.JWT_SECRET;

    if (!secrectKey) {
      throw new ErrorHandler(500, "Key is not defined");
    }

    const token = sign({}, secrectKey, {
      subject: email,
      expiresIn: process.env.JWT_EXPIRE,
    });

    return { user: userAlreadyExists, token };
  }
}
