import { IUserRepository } from "../../../repository";
import { ErrorHandler } from "../../../http/middleware/errorResponse";

interface editUserRequest {
  name?: string;
  email: string;
  phone?: string;
  gender?: string;
  dateBirth?: string;
}

interface editUserResponse {
  name?: string;
  email: string;
  phone?: string;
  gender?: string;
  dateBirth?: string;
}

export class EditUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: editUserRequest): Promise<editUserResponse> {
    const { email } = data;

    const userAlreadyExists = await this.userRepository.getUser({
      email,
    });

    if (!userAlreadyExists) {
      throw new ErrorHandler(400, "User not exists, try again");
    }

    const updateUser = {
      name: data.name || userAlreadyExists.name,
      email,
      phone: data.phone || userAlreadyExists.phone,
      gender: data.gender || userAlreadyExists.gender,
      dateBirth: data.dateBirth || userAlreadyExists.dateBirth
    };


    await this.userRepository.editUser(updateUser);

    return updateUser;
  }
}
