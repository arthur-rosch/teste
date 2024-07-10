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

// src/http/controller/task/create.ts
var create_exports = {};
__export(create_exports, {
  createTask: () => createTask
});
module.exports = __toCommonJS(create_exports);

// src/repository/prisma/prisma-user-repository.ts
var UserRepository = class {
  constructor(prisma2) {
    this.prisma = prisma2;
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
  constructor(prisma2) {
    this.prisma = prisma2;
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
  constructor(prisma2) {
    this.prisma = prisma2;
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

// src/repository/prisma/prisma-task-repository.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var TaskRepository = class {
  delete(taskId) {
    return __async(this, null, function* () {
      yield prisma.task.delete({
        where: { id: taskId }
      });
    });
  }
  create(data) {
    return __async(this, null, function* () {
      return yield prisma.task.create({
        data
      });
    });
  }
  updateStatus(taskId, status) {
    return __async(this, null, function* () {
      return yield prisma.task.update({
        where: { id: taskId },
        data: { status }
      });
    });
  }
  findById(taskId) {
    return __async(this, null, function* () {
      const task = yield prisma.task.findUnique({
        where: { id: taskId }
      });
      if (!task) return null;
      return task;
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

// src/use-cases/cases/task/create.ts
var CreateTaskUseCase = class {
  constructor(notificationRepository, notificationService, taskRepository, projectRepository, userRepository) {
    this.notificationRepository = notificationRepository;
    this.notificationService = notificationService;
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const projectExists = yield this.projectRepository.findProjectById(
        data.projectId
      );
      if (!projectExists) {
        throw new ErrorHandler(400, "Project does not exist");
      }
      if (data.responsibleId) {
        const responsibleExists = yield this.userRepository.getUserById(
          data.responsibleId
        );
        if (!responsibleExists) {
          throw new ErrorHandler(400, "Responsible not found, try again");
        }
        const isInProject = yield this.projectRepository.isUserInProject(
          data.projectId,
          data.responsibleId
        );
        if (!isInProject) {
          throw new ErrorHandler(400, "Responsible user is not in the project");
        }
      }
      const notificationParams = {
        userId: data.responsibleId,
        senderId: projectExists.ownerId,
        message: `Voc\xEA foi adicionado a tarefa ${data.title}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      const newTask = yield this.taskRepository.create(data);
      return newTask;
    });
  }
};

// src/use-cases/factories/task/create.ts
var import_client2 = require("@prisma/client");
function makeCreateTask() {
  const prisma2 = new import_client2.PrismaClient();
  const notificationRepository = new NotificationRepository(prisma2);
  const notificationService = new SendNotification();
  const taskRepository = new TaskRepository();
  const projectRepository = new ProjectRepository(prisma2);
  const userRepository = new UserRepository(prisma2);
  const createTask2 = new CreateTaskUseCase(
    notificationRepository,
    notificationService,
    taskRepository,
    projectRepository,
    userRepository
  );
  return createTask2;
}

// src/http/controller/task/create.ts
var import_client3 = require("@prisma/client");
var import_zod2 = require("zod");
function createTask(req, res, next) {
  return __async(this, null, function* () {
    try {
      const StatusSchema = import_zod2.z.enum([
        import_client3.Status.Analysis,
        import_client3.Status.Completed,
        import_client3.Status.Development,
        import_client3.Status.Testing,
        import_client3.Status.To_Do
      ]);
      const bodySchema = import_zod2.z.object({
        title: import_zod2.z.string(),
        information: import_zod2.z.string(),
        files: import_zod2.z.string(),
        status: StatusSchema,
        projectId: import_zod2.z.string(),
        responsibleId: import_zod2.z.string()
      });
      const data = bodySchema.parse(req.body);
      const taskUseCase = makeCreateTask();
      const task = yield taskUseCase.execute(data);
      return res.status(200).send(task);
    } catch (error) {
      next(error);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createTask
});
