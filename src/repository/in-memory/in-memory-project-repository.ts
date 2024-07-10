import { IProjectRepository } from '@/repository'
import { Projects, Prisma, Privacy } from '@prisma/client'

export class InMemoryProjectRepository implements IProjectRepository {
  private projects: Projects[] = []

  async delete(projectId: string): Promise<void> {
    this.projects = this.projects.filter((project) => project.id !== projectId)
  }

  async findAll(userId: string): Promise<Projects[]> {
    return this.projects.filter((project) => project.usersIds.includes(userId))
  }

  async findByUserId(userId: string): Promise<Projects[]> {
    return this.findAll(userId)
  }

  async findProjectById(projectId: string): Promise<Projects | null> {
    const project = this.projects.find((project) => project.id === projectId)
    return project || null
  }

  async addUserInProject(projectId: string, userId: string): Promise<Projects> {
    const project = this.projects.find((project) => project.id === projectId)

    if (!project!.usersIds.includes(userId)) {
      project!.usersIds.push(userId)
    }
    return project!
  }

  async removeUserInProject(
    projectId: string,
    userId: string,
  ): Promise<Projects> {
    const project = this.projects.find((project) => project.id === projectId)

    project!.usersIds = project!.usersIds.filter((user) => user !== userId)

    return project!
  }

  async create(data: Prisma.ProjectsUncheckedCreateInput): Promise<Projects> {
    const usersIds = data.usersIds ?? []

    if (
      !Array.isArray(usersIds) ||
      !usersIds.every((id) => typeof id === 'string')
    ) {
      throw new Error('usersIds must be an array of strings')
    }

    const newProject: Projects = {
      id: '1',
      name: data.name,
      color: data.color,
      ownerId: data.ownerId,
      privacy: data.privacy ?? 'Private',
      createdAt: new Date(),
      updatedAt: new Date(),
      usersIds,
    }

    this.projects.push(newProject)
    return newProject
  }

  async updateStatus(projectId: string, status: Privacy): Promise<Projects> {
    const project = this.projects.find((project) => project.id === projectId)

    project!.privacy = status

    return project!
  }

  async isUserInProject(projectId: string, userId: string): Promise<boolean> {
    const project = this.projects.find((project) => project.id === projectId)
    return project ? project.usersIds.includes(userId) : false
  }
}
