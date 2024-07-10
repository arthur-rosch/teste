import { Projects, Privacy, Prisma } from "@prisma/client";

export interface IProjectRepository {
  delete(projectId: string): Promise<void>;
  findAll(userId: string): Promise<Projects[]>;
  findByUserId(useId: string): Promise<Projects[]>;
  findProjectById(projectId: string): Promise<Projects | null>;
  addUserInProject(projectId: string, useId: string): Promise<Projects>;
  removeUserInProject(projectId: string, useId: string): Promise<Projects>;
  create(data: Prisma.RoomUncheckedCreateInput): Promise<Projects>;
  updateStatus(projectId: string, status: Privacy): Promise<Projects>;
  isUserInProject(projectId: string, userId: string): Promise<boolean>;
}
