import { describe, it, beforeEach, expect } from "vitest";
import { AddUserInProjectUseCase } from "./add-user-in-project";
import {
  InMemoryNotificationRepository,
  InMemoryProjectRepository,
  InMemoryUserRepository,
} from "@/repository/in-memory";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { SendNotification } from "@/service/sendNotification";

let notificationRepository: InMemoryNotificationRepository;
let notificationService: SendNotification;
let projectRepository: InMemoryProjectRepository;
let userRepository: InMemoryUserRepository;
let sut: AddUserInProjectUseCase;

describe("Add User In Project Use Case", () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    (notificationService = new SendNotification()),
      (projectRepository = new InMemoryProjectRepository());
    userRepository = new InMemoryUserRepository();
    sut = new AddUserInProjectUseCase(
      notificationRepository,
      notificationService,
      projectRepository,
      userRepository
    );
  });

  it("should be able to add a user to a project", async () => {
    const owner = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "hashed-password",
    });

    const user = await userRepository.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "hashed-password",
    });

    const project = await projectRepository.create({
      name: "Project 1",
      color: "green",
      ownerId: owner.id,
      privacy: "Public",
      usersIds: [],
    });

    const response = await sut.execute({
      ownerId: owner.id,
      projectId: project.id,
      userId: user.id,
    });

    expect(response.message).toBe("User added successfully");
    const updatedProject = await projectRepository.findProjectById(project.id);
    expect(updatedProject!.usersIds).toContain(user.id);
  });

  it("should not be able to add a user if the owner is not found", async () => {
    const user = await userRepository.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "hashed-password",
    });

    const project = await projectRepository.create({
      name: "Project 1",
      color: "green",
      ownerId: "non-existent-owner-id",
      privacy: "Public",
      usersIds: [],
    });

    await expect(
      sut.execute({
        ownerId: "non-existent-owner-id",
        projectId: project.id,
        userId: user.id,
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  });

  it("should not be able to add a user if the user is not found", async () => {
    const owner = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "hashed-password",
    });

    const project = await projectRepository.create({
      name: "Project 1",
      color: "green",
      ownerId: owner.id,
      privacy: "Public",
      usersIds: [],
    });

    await expect(
      sut.execute({
        ownerId: owner.id,
        projectId: project.id,
        userId: "non-existent-user-id",
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  });

  it("should not be able to add a user if the project is not found", async () => {
    const owner = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "hashed-password",
    });

    const user = await userRepository.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "hashed-password",
    });

    await expect(
      sut.execute({
        ownerId: owner.id,
        projectId: "non-existent-project-id",
        userId: user.id,
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  });

  it("should return a message if the user is already in the project", async () => {
    const owner = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "hashed-password",
    });

    const user = await userRepository.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "hashed-password",
    });

    const project = await projectRepository.create({
      name: "Project 1",
      color: "green",
      ownerId: owner.id,
      privacy: "Public",
      usersIds: [user.id],
    });

    const response = await sut.execute({
      ownerId: owner.id,
      projectId: project.id,
      userId: user.id,
    });

    expect(response.message).toBe("User is already in the project");
  });
});
