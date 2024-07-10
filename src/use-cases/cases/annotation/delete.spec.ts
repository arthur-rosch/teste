import { expect, describe, it, beforeEach } from "vitest";
import { DeleteAnnotationUseCase } from "./delete";
import {
  InMemoryAnnotationRepository,
  InMemoryNotificationRepository,
  InMemoryUserRepository,
} from "@/repository/in-memory";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { createMockUser } from "@/utils";
import { SendNotification } from "@/service/sendNotification";

let notificationRepository: InMemoryNotificationRepository;
let notificationService: SendNotification;
let annotationRepository: InMemoryAnnotationRepository;
let userRepository: InMemoryUserRepository;
let sut: DeleteAnnotationUseCase;

describe("Delete Annotation Use Case", () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    notificationService = new SendNotification();
    annotationRepository = new InMemoryAnnotationRepository();
    userRepository = new InMemoryUserRepository();
    sut = new DeleteAnnotationUseCase(
      notificationRepository,
      notificationService,
      annotationRepository,
      userRepository
    );
  });

  it("should be able to delete an annotation", async () => {
    const { id } = await createMockUser(userRepository);

    const annotation = await annotationRepository.create({
      id: "1",
      color: "blue",
      information: "This is a test annotation",
      title: "Test Annotation",
      userId: id,
    });

    const deletedAnnotation = await sut.execute({
      userId: id,
      annotationId: annotation.id,
    });

    expect(deletedAnnotation.id).toBe(annotation.id);
    expect(await annotationRepository.getById(annotation.id)).toBeNull();
  });

  it("should not be able to delete an annotation if user not found", async () => {
    await expect(
      sut.execute({
        userId: "non-existent-user",
        annotationId: "1",
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  });

  it("should not be able to delete an annotation if annotation not found", async () => {
    const { id } = await createMockUser(userRepository);

    await expect(
      sut.execute({
        userId: id,
        annotationId: "non-existent-annotation",
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  });

  it("should not be able to delete an annotation if user is not the owner", async () => {
    const owner = await createMockUser(userRepository);
    const anotherUser = await createMockUser(userRepository);

    const annotation = await annotationRepository.create({
      id: "1",
      color: "blue",
      information: "This is a test annotation",
      title: "Test Annotation",
      userId: owner.id,
    });

    await expect(
      sut.execute({
        userId: anotherUser.id,
        annotationId: annotation.id,
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  });
});
