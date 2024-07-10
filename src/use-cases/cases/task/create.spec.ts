import { chance } from "@/lib";
import { Prisma } from "@prisma/client";
import { CreateTaskUseCase } from "./create";
import { describe, it, expect, beforeEach } from "vitest";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { createMockUser, createMockUserAndProject } from "@/utils";
import {
  InMemoryTaskRepository,
  InMemoryProjectRepository,
  InMemoryUserRepository,
  InMemoryNotificationRepository,
} from "@/repository/in-memory";
import { SendNotification } from "@/service/sendNotification";

let sut: CreateTaskUseCase;
let taskRepository: InMemoryTaskRepository;
let userRepository: InMemoryUserRepository;
let taskData: Prisma.TaskUncheckedCreateInput;
let projectRepository: InMemoryProjectRepository;
let notificationRepository: InMemoryNotificationRepository;
let notificationService: SendNotification;

describe("Create Task Use Case", () => {
  const setupTaskData = async () => {
    const { user, project } = await createMockUserAndProject(
      userRepository,
      projectRepository
    );
    taskData = {
      title: chance.sentence({ words: 3 }),
      information: chance.paragraph(),
      status: "To_Do",
      projectId: project.id,
      responsibleId: user.id,
      files: chance.url(),
    };
  };

  beforeEach(async () => {
    taskRepository = new InMemoryTaskRepository();
    projectRepository = new InMemoryProjectRepository();
    userRepository = new InMemoryUserRepository();
    notificationRepository = new InMemoryNotificationRepository();
    notificationService = new SendNotification();
    sut = new CreateTaskUseCase(
      notificationRepository,
      notificationService,
      taskRepository,
      projectRepository,
      userRepository
    );

    await setupTaskData();
  });

  it("should be able to create a task", async () => {
    const task = await sut.execute(taskData);

    expect(task).toHaveProperty("id");
    expect(task.title).toBe(taskData.title);
  });

  it("should not be able to create a task if project does not exist", async () => {
    const invalidTaskData = {
      ...taskData,
      projectId: "nonexistent-project-id",
    };

    await expect(sut.execute(invalidTaskData)).rejects.toBeInstanceOf(
      ErrorHandler
    );
  });

  it("should not be able to create a task if responsible user does not exist", async () => {
    const invalidTaskData = {
      ...taskData,
      responsibleId: "nonexistent-user-id",
    };

    await expect(sut.execute(invalidTaskData)).rejects.toBeInstanceOf(
      ErrorHandler
    );
  });

  it("should not be able to create a task if responsible user is not in the project", async () => {
    const anotherUser = await createMockUser(userRepository);
    const invalidTaskData = { ...taskData, responsibleId: anotherUser.id };

    await expect(sut.execute(invalidTaskData)).rejects.toBeInstanceOf(
      ErrorHandler
    );
  });
});
