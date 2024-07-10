import { IProjectRepository } from "@/repository";
import { PrismaClient, Projects, Privacy, Prisma } from "@prisma/client";

export class ProjectRepository implements IProjectRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async delete(projectId: string): Promise<void> {
    await this.prisma.projects.delete({
      where: { id: projectId },
    });
  }

  async findAll(userId: string): Promise<Projects[]> {
    return await this.prisma.projects.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Projects[]> {
    return await this.prisma.projects.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  async findProjectById(projectId: string): Promise<Projects | null> {
    const project = await this.prisma.projects.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return null;
    }

    return project;
  }

  async addUserInProject(projectId: string, userId: string): Promise<Projects> {
    const project = await this.prisma.projects.update({
      where: { id: projectId },
      data: {
        users: {
          connect: { id: userId },
        },
        usersIds: {
          push: userId, // Adiciona o userId no array usersIds
        },
      },
      include: {
        users: true,
      },
    });
    return project;
  }

  async removeUserInProject(
    projectId: string,
    userId: string
  ): Promise<Projects> {
    const project = await this.prisma.projects.update({
      where: { id: projectId },
      data: {
        users: {
          disconnect: { id: userId },
        },
        usersIds: {
          set: (await this.prisma.projects.findUnique({
            where: { id: projectId },
            select: { usersIds: true },
          }))!.usersIds.filter((id) => id !== userId), // Remove o userId do array usersIds
        },
      },
      include: {
        users: true,
      },
    });
    return project;
  }

  async create(
    data: Prisma.ProjectsUncheckedCreateInput & { usersIds: string[] }
  ): Promise<Projects> {
    const { name, color, ownerId, privacy, usersIds } = data;
    return await this.prisma.projects.create({
      data: {
        name,
        color,
        ownerId,
        privacy,
        users: {
          connect: usersIds.map((id) => ({ id })),
        },
      },
    });
  }

  async updateStatus(projectId: string, status: Privacy): Promise<Projects> {
    return await this.prisma.projects.update({
      where: { id: projectId },
      data: { privacy: status },
    });
  }

  async isUserInProject(projectId: string, userId: string): Promise<boolean> {
    const count = await this.prisma.projects.count({
      where: {
        id: projectId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
    return count > 0;
  }
}
