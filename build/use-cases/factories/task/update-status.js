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

// src/use-cases/factories/task/update-status.ts
var update_status_exports = {};
__export(update_status_exports, {
  makeUpdateTaskStatus: () => makeUpdateTaskStatus
});
module.exports = __toCommonJS(update_status_exports);

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

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/task/update-status.ts
var UpdateTaskStatusUseCase = class {
  constructor(taskRepository, userRepository) {
    this.taskRepository = taskRepository;
    this.userRepository = userRepository;
  }
  execute(taskId, status, userId) {
    return __async(this, null, function* () {
      const user = yield this.userRepository.getUserById(userId);
      if (!user) {
        throw new ErrorHandler(400, "User not found, try again");
      }
      const taskExists = yield this.taskRepository.findById(taskId);
      if (!taskExists) {
        throw new ErrorHandler(400, "Task not found, try again");
      }
      const updatedTask = yield this.taskRepository.updateStatus(taskId, status);
      return updatedTask;
    });
  }
};

// src/use-cases/factories/task/update-status.ts
var import_client2 = require("@prisma/client");
function makeUpdateTaskStatus() {
  const prisma2 = new import_client2.PrismaClient();
  const taskRepository = new TaskRepository();
  const userRepository = new UserRepository(prisma2);
  const createTask = new UpdateTaskStatusUseCase(
    taskRepository,
    userRepository
  );
  return createTask;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeUpdateTaskStatus
});
