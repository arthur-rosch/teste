import { hash } from "bcryptjs";
import { CreateProjectUseCase } from "./create";
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
let sut: CreateProjectUseCase;

describe("Create Project Use Case", () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    notificationService = new SendNotification();
    projectRepository = new InMemoryProjectRepository();
    userRepository = new InMemoryUserRepository();
    sut = new CreateProjectUseCase(
      notificationRepository,
      notificationService,
      projectRepository,
      userRepository
    );
  });

  it("should be able to create project", async () => {
    const { id } = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hash("123456", 6),
    });

    const project = await sut.execute({
      color: "green",
      name: "Project 1",
      privacy: "Public",
      ownerId: id,
      usersIds: [id],
    });

    expect(project.id).toBeTruthy();
  });

  it("should not be able to create with wrong id", async () => {
    await expect(() =>
      sut.execute({
        color: "green",
        name: "Project 1",
        privacy: "Public",
        ownerId: "10",
        usersIds: ["10"],
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  });
});
