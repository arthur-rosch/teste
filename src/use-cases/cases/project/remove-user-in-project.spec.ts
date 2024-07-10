import { hash } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { RemoveUserInProjectUseCase } from "./remove-user-in-project";
import {
  InMemoryNotificationRepository,
  InMemoryProjectRepository,
  InMemoryUserRepository,
} from "@/repository/in-memory";
import { SendNotification } from "@/service/sendNotification";

let notificationRepository: InMemoryNotificationRepository;
let notificationService: SendNotification;
let userRepository: InMemoryUserRepository;
let projectRepository: InMemoryProjectRepository;
let sut: RemoveUserInProjectUseCase;

describe("Remove User In Project Use Case", () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    notificationService = new SendNotification();
    projectRepository = new InMemoryProjectRepository();
    userRepository = new InMemoryUserRepository();
    sut = new RemoveUserInProjectUseCase(
      notificationRepository,
      notificationService,
      projectRepository,
      userRepository
    );
  });

  it("should be able to remove user from project", async () => {
    const { id: ownerId } = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hash("123456", 6),
    });

    const { id: userId } = await userRepository.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: await hash("123456", 6),
    });

    const project = await projectRepository.create({
      color: "green",
      name: "Project 1",
      privacy: "Public",
      ownerId,
      usersIds: [ownerId, userId],
    });

    const response = await sut.execute({
      ownerId,
      projectId: project.id,
      userId,
    });

    expect(response.message).toBe("User removed successfully");
    const projectUpdated = await projectRepository.findProjectById(project.id);
    expect(projectUpdated!.usersIds).not.toContain(userId);
  });

  it("should not be able to remove user with non-existent owner", async () => {
    const { id: userId } = await userRepository.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: await hash("123456", 6),
    });

    const project = await projectRepository.create({
      color: "green",
      name: "Project 1",
      privacy: "Public",
      ownerId: "non-existent-owner-id",
      usersIds: [userId],
    });

    await expect(() =>
      sut.execute({
        ownerId: "non-existent-owner-id",
        projectId: project.id,
        userId,
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  });

  it("should not be able to remove non-existent user from project", async () => {
    const { id: ownerId } = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hash("123456", 6),
    });

    const project = await projectRepository.create({
      color: "green",
      name: "Project 1",
      privacy: "Public",
      ownerId,
      usersIds: [ownerId],
    });

    await expect(() =>
      sut.execute({
        ownerId,
        projectId: project.id,
        userId: "non-existent-user-id",
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  });

  it("should not be able to remove user from non-existent project", async () => {
    const { id: ownerId } = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hash("123456", 6),
    });

    const { id: userId } = await userRepository.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        ownerId,
        projectId: "non-existent-project-id",
        userId,
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  });

  it("should return a message if user is not in project", async () => {
    const { id: ownerId } = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hash("123456", 6),
    });

    const { id: userId } = await userRepository.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: await hash("123456", 6),
    });

    const project = await projectRepository.create({
      color: "green",
      name: "Project 1",
      privacy: "Public",
      ownerId,
      usersIds: [ownerId],
    });

    const response = await sut.execute({
      ownerId,
      projectId: project.id,
      userId,
    });

    expect(response.message).toBe("Not User is already in the project");
  });
});
