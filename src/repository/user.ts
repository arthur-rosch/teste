import { User } from "@prisma/client";

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  getUser(user: Pick<User, "email">): Promise<User | null>;
  getUserById(userId: string): Promise<User | null>;
  editUser(data: Partial<User>): Promise<void>;
  deleteUser(user: Pick<User, "email">): Promise<void>;
  getManyUsersByEmail(email: string[]): Promise<User[]>;
  changePassword(data: Partial<User>): Promise<void>;
  getAllUsers(): Promise<User[] | null>;
}
