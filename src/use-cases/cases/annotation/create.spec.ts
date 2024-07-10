import { createMockUser } from "@/utils";
import { CreateAnnotationUseCase } from "./create";
import { expect, describe, it, beforeEach } from "vitest";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import {
  InMemoryAnnotationRepository,
  InMemoryNotificationRepository,
  InMemoryUserRepository,
} from "@/repository/in-memory";
import { SendNotification } from "@/service/sendNotification";

let notificationRepository: InMemoryNotificationRepository;
let notificationService: SendNotification;
let userRepository: InMemoryUserRepository;
let annotationRepository: InMemoryAnnotationRepository;
let sut: CreateAnnotationUseCase;

describe("Create Annotation Use Case", () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    (notificationService = new SendNotification()),
      (annotationRepository = new InMemoryAnnotationRepository());
    userRepository = new InMemoryUserRepository();
    sut = new CreateAnnotationUseCase(
      notificationRepository,
      notificationService,
      annotationRepository,
      userRepository
    );
  });

  it("should be able to create annotation", async () => {
    const { id } = await createMockUser(userRepository);

    const annotation = await sut.execute({
      color: "blue",
      information: "This is a test annotation",
      title: "Test Annotation",
      userId: id,
    });

    expect(annotation.id).toBeTruthy();
  });

  it("should not be able to create annotation with wrong user id", async () => {
    await expect(() =>
      sut.execute({
        color: "blue",
        information: "This is a test annotation",
        title: "Test Annotation",
        userId: "non-existent-user-id",
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  });
});
