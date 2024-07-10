import { hash } from "bcryptjs";
import { DeleteProjectUseCase } from "./delete";
import { expect, describe, it, beforeEach } from "vitest";
import { ErrorHandler } from "@/http/middleware/errorResponse";
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
let sut: DeleteProjectUseCase;

describe("Delete Project Use Case", () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    notificationService = new SendNotification();
    projectRepository = new InMemoryProjectRepository();
    userRepository = new InMemoryUserRepository();
    sut = new DeleteProjectUseCase(
      notificationRepository,
      notificationService,
      projectRepository,
      userRepository
    );
  });

  it("should be able to delete a project", async () => {
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

    await sut.execute(project.id, ownerId);

    const deletedProject = await projectRepository.findProjectById(project.id);

    expect(deletedProject).toBeNull();
  });

  it("should not be able to delete a project with wrong owner id", async () => {
    const { id: ownerId } = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hash("123456", 6),
    });

    const { id: otherUserId } = await userRepository.create({
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

    await expect(() =>
      sut.execute(project.id, otherUserId)
    ).rejects.toBeInstanceOf(ErrorHandler);
  });

  it("should not be able to delete a non-existent project", async () => {
    const { id: ownerId } = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute("non-existent-project-id", ownerId)
    ).rejects.toThrow("Project does not exist");
  });

  it("should not be able to delete a project with non-existent owner", async () => {
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

    await userRepository.deleteUser({ email: "johndoe@example.com" });

    await expect(() => sut.execute(project.id, ownerId)).rejects.toBeInstanceOf(
      ErrorHandler
    );
  });
});
