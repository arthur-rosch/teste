"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/use-cases/factories/project/delete.ts
var delete_exports = {};
__export(delete_exports, {
  makeDeleteProject: () => makeDeleteProject
});
module.exports = __toCommonJS(delete_exports);

// src/repository/prisma/prisma-user-repository.ts
var UserRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getManyUsersByEmail(emails) {
    return __async(this, null, function* () {
      const users = yield this.prisma.user.findMany({
        where: {
          email: {
            in: emails
          }
        }
      });
      return users;
    });
  }
  create(data) {
    return __async(this, null, function* () {
      const { name, email, phone, gender, dateBirth, password } = data;
      const createUser = yield this.prisma.user.create({
        data: {
          name,
          email,
          phone,
          gender,
          dateBirth,
          password
        }
      });
      return createUser;
    });
  }
  getUser(user) {
    return __async(this, null, function* () {
      const findUser = yield this.prisma.user.findFirst({
        where: {
          email: user.email
        }
      });
      return findUser;
    });
  }
  getUserById(userId) {
    return __async(this, null, function* () {
      const findUser = yield this.prisma.user.findUnique({
        where: {
          id: userId
        }
      });
      if (!findUser) {
        return null;
      }
      return findUser;
    });
  }
  editUser(data) {
    return __async(this, null, function* () {
      yield this.prisma.user.update({
        where: {
          email: data.email
        },
        data
      });
    });
  }
  deleteUser(user) {
    return __async(this, null, function* () {
      yield this.prisma.user.delete({
        where: {
          email: user.email
        }
      });
    });
  }
  changePassword(data) {
    return __async(this, null, function* () {
      const { email, password } = data;
      yield this.prisma.user.update({
        where: {
          email
        },
        data: {
          password
        }
      });
    });
  }
  getAllUsers() {
    return __async(this, null, function* () {
      const users = yield this.prisma.user.findMany();
      return users.length > 0 ? users : null;
    });
  }
};

// src/repository/prisma/prisma-notification-repository.ts
var NotificationRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  create(data) {
    return __async(this, null, function* () {
      return yield this.prisma.notification.create({ data });
    });
  }
  getUserId(userId) {
    return __async(this, null, function* () {
      return yield this.prisma.notification.findFirst({
        where: {
          userId
        }
      });
    });
  }
  updateReadyNotification(notificationId, ready) {
    return __async(this, null, function* () {
      yield this.prisma.notification.update({
        where: {
          id: notificationId
        },
        data: {
          isRead: ready
        }
      });
    });
  }
};

// src/repository/prisma/prisma-project-repository.ts
var ProjectRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  delete(projectId) {
    return __async(this, null, function* () {
      yield this.prisma.projects.delete({
        where: { id: projectId }
      });
    });
  }
  findAll(userId) {
    return __async(this, null, function* () {
      return yield this.prisma.projects.findMany({
        where: {
          users: {
            some: {
              id: userId
            }
          }
        }
      });
    });
  }
  findByUserId(userId) {
    return __async(this, null, function* () {
      return yield this.prisma.projects.findMany({
        where: {
          users: {
            some: {
              id: userId
            }
          }
        }
      });
    });
  }
  findProjectById(projectId) {
    return __async(this, null, function* () {
      const project = yield this.prisma.projects.findUnique({
        where: { id: projectId }
      });
      if (!project) {
        return null;
      }
      return project;
    });
  }
  addUserInProject(projectId, userId) {
    return __async(this, null, function* () {
      const project = yield this.prisma.projects.update({
        where: { id: projectId },
        data: {
          users: {
            connect: { id: userId }
          },
          usersIds: {
            push: userId
            // Adiciona o userId no array usersIds
          }
        },
        include: {
          users: true
        }
      });
      return project;
    });
  }
  removeUserInProject(projectId, userId) {
    return __async(this, null, function* () {
      const project = yield this.prisma.projects.update({
        where: { id: projectId },
        data: {
          users: {
            disconnect: { id: userId }
          },
          usersIds: {
            set: (yield this.prisma.projects.findUnique({
              where: { id: projectId },
              select: { usersIds: true }
            })).usersIds.filter((id) => id !== userId)
            // Remove o userId do array usersIds
          }
        },
        include: {
          users: true
        }
      });
      return project;
    });
  }
  create(data) {
    return __async(this, null, function* () {
      const { name, color, ownerId, privacy, usersIds } = data;
      return yield this.prisma.projects.create({
        data: {
          name,
          color,
          ownerId,
          privacy,
          users: {
            connect: usersIds.map((id) => ({ id }))
          }
        }
      });
    });
  }
  updateStatus(projectId, status) {
    return __async(this, null, function* () {
      return yield this.prisma.projects.update({
        where: { id: projectId },
        data: { privacy: status }
      });
    });
  }
  isUserInProject(projectId, userId) {
    return __async(this, null, function* () {
      const count = yield this.prisma.projects.count({
        where: {
          id: projectId,
          users: {
            some: {
              id: userId
            }
          }
        }
      });
      return count > 0;
    });
  }
};

// src/service/sendNotification.ts
var SendNotification = class {
  send(data) {
    return __async(this, null, function* () {
    });
  }
};

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/project/delete.ts
var DeleteProjectUseCase = class {
  constructor(notificationRepository, notificationService, projectRepository, userRepository) {
    this.notificationRepository = notificationRepository;
    this.notificationService = notificationService;
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
  }
  execute(projectId, ownerId) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(ownerId);
      if (!owner) {
        throw new ErrorHandler(400, "User not found, try again");
      }
      const projectExists = yield this.projectRepository.findProjectById(projectId);
      if (!projectExists) {
        throw new Error("Project does not exist");
      }
      if (projectExists.ownerId !== ownerId) {
        throw new ErrorHandler(
          400,
          "Unauthorized, Only owner can delete the Project"
        );
      }
      const notificationParams = {
        userId: ownerId,
        senderId: ownerId,
        message: `Voc\xEA acabou de deletar o projeto ${projectExists.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      yield this.projectRepository.delete(projectId);
    });
  }
};

// src/use-cases/factories/project/delete.ts
var import_client = require("@prisma/client");
function makeDeleteProject() {
  const prisma = new import_client.PrismaClient();
  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const projectRepository = new ProjectRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const deleteProject = new DeleteProjectUseCase(
    notificationRepository,
    notificationService,
    projectRepository,
    userRepository
  );
  return deleteProject;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeDeleteProject
});
