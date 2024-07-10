import { User } from "@prisma/client";
import { IUserRepository } from "@/repository";
import { randomUUID } from "crypto";

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async create(data: Partial<User>): Promise<User> {
    const newUser: User = {
      id: randomUUID(),
      name: data.name!,
      email: data.email!,
      phone: data.phone!,
      gender: data.gender!,
      dateBirth: data.dateBirth!,
      password: data.password!,
    };
    this.users.push(newUser);
    return newUser;
  }

  async getUser(user: Pick<User, "email">): Promise<User | null> {
    return this.users.find((u) => u.email === user.email) || null;
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.find((u) => u.id === userId) || null;
  }

  async editUser(data: Partial<User>): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === data.id);

    this.users[userIndex] = { ...this.users[userIndex], ...data };
  }

  async deleteUser(user: Pick<User, "email">): Promise<void> {
    this.users = this.users.filter((u) => u.email !== user.email);
  }

  async getManyUsersByEmail(emails: string[]): Promise<User[]> {
    return this.users.filter((u) => emails.includes(u.email));
  }

  async changePassword(data: Partial<User>): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.email === data.email);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        password: data.password || "",
      };
    }
  }

  async getAllUsers(): Promise<User[] | null> {
    return this.users;
  }
}
