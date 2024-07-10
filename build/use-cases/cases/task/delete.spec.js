"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/utils/test/mock-user.ts
var import_chance = __toESM(require("chance"));
var import_bcryptjs = require("bcryptjs");
var chance = new import_chance.default();
function createMockUser(userRepository2) {
  return __async(this, null, function* () {
    const name = chance.name();
    const email = chance.email();
    const password = yield (0, import_bcryptjs.hash)(chance.string({ length: 8 }), 6);
    return yield userRepository2.create({
      name,
      email,
      password
    });
  });
}

// src/lib/change.ts
var import_chance2 = __toESM(require("chance"));
var chance2 = new import_chance2.default();

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/utils/test/mock-user-and-project.ts
var import_chance3 = __toESM(require("chance"));
var chance3 = new import_chance3.default();
function createMockUserAndProject(userRepository2, projectRepository2) {
  return __async(this, null, function* () {
    const user = yield createMockUser(userRepository2);
    const project = yield projectRepository2.create({
      name: chance3.word({ length: 5 }),
      color: chance3.color({ format: "hex" }),
      ownerId: user.id,
      usersIds: [user.id],
      privacy: "Private"
    });
    return { user, project };
  });
}

// src/utils/test/mock-task.ts
function createMockTask(userRepository2, projectRepository2, taskRepository2) {
  return __async(this, null, function* () {
    const { user, project } = yield createMockUserAndProject(
      userRepository2,
      projectRepository2
    );
    const taskData = {
      title: chance2.sentence({ words: 3 }),
      information: chance2.paragraph(),
      files: chance2.url(),
      status: "To_Do",
      projectId: project.id,
      responsibleId: user.id
    };
    const task = yield taskRepository2.create(taskData);
    return task;
  });
}

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/task/delete.ts
var DeleteTaskUseCase = class {
  constructor(taskRepository2, userRepository2) {
    this.taskRepository = taskRepository2;
    this.userRepository = userRepository2;
  }
  execute(taskId, userId) {
    return __async(this, null, function* () {
      const user = yield this.userRepository.getUserById(userId);
      if (!user) {
        throw new ErrorHandler(400, "User not found, try again");
      }
      const taskExists = yield this.taskRepository.findById(taskId);
      if (!taskExists) {
        throw new ErrorHandler(400, "Task not found, try again");
      }
      yield this.taskRepository.delete(taskId);
      return { message: "Task deleted successfully" };
    });
  }
};

// src/use-cases/cases/task/delete.spec.ts
var import_vitest = require("vitest");

// src/repository/in-memory/in-memory-project-repository.ts
var InMemoryProjectRepository = class {
  constructor() {
    this.projects = [];
  }
  delete(projectId) {
    return __async(this, null, function* () {
      this.projects = this.projects.filter((project) => project.id !== projectId);
    });
  }
  findAll(userId) {
    return __async(this, null, function* () {
      return this.projects.filter((project) => project.usersIds.includes(userId));
    });
  }
  findByUserId(userId) {
    return __async(this, null, function* () {
      return this.findAll(userId);
    });
  }
  findProjectById(projectId) {
    return __async(this, null, function* () {
      const project = this.projects.find((project2) => project2.id === projectId);
      return project || null;
    });
  }
  addUserInProject(projectId, userId) {
    return __async(this, null, function* () {
      const project = this.projects.find((project2) => project2.id === projectId);
      if (!project.usersIds.includes(userId)) {
        project.usersIds.push(userId);
      }
      return project;
    });
  }
  removeUserInProject(projectId, userId) {
    return __async(this, null, function* () {
      const project = this.projects.find((project2) => project2.id === projectId);
      project.usersIds = project.usersIds.filter((user) => user !== userId);
      return project;
    });
  }
  create(data) {
    return __async(this, null, function* () {
      var _a, _b;
      const usersIds = (_a = data.usersIds) != null ? _a : [];
      if (!Array.isArray(usersIds) || !usersIds.every((id) => typeof id === "string")) {
        throw new Error("usersIds must be an array of strings");
      }
      const newProject = {
        id: "1",
        name: data.name,
        color: data.color,
        ownerId: data.ownerId,
        privacy: (_b = data.privacy) != null ? _b : "Private",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        usersIds
      };
      this.projects.push(newProject);
      return newProject;
    });
  }
  updateStatus(projectId, status) {
    return __async(this, null, function* () {
      const project = this.projects.find((project2) => project2.id === projectId);
      project.privacy = status;
      return project;
    });
  }
  isUserInProject(projectId, userId) {
    return __async(this, null, function* () {
      const project = this.projects.find((project2) => project2.id === projectId);
      return project ? project.usersIds.includes(userId) : false;
    });
  }
};

// src/repository/in-memory/in-memory-user-repository.ts
var import_crypto = require("crypto");
var InMemoryUserRepository = class {
  constructor() {
    this.users = [];
  }
  create(data) {
    return __async(this, null, function* () {
      const newUser = {
        id: (0, import_crypto.randomUUID)(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateBirth: data.dateBirth,
        password: data.password
      };
      this.users.push(newUser);
      return newUser;
    });
  }
  getUser(user) {
    return __async(this, null, function* () {
      return this.users.find((u) => u.email === user.email) || null;
    });
  }
  getUserById(userId) {
    return __async(this, null, function* () {
      return this.users.find((u) => u.id === userId) || null;
    });
  }
  editUser(data) {
    return __async(this, null, function* () {
      const userIndex = this.users.findIndex((u) => u.id === data.id);
      this.users[userIndex] = __spreadValues(__spreadValues({}, this.users[userIndex]), data);
    });
  }
  deleteUser(user) {
    return __async(this, null, function* () {
      this.users = this.users.filter((u) => u.email !== user.email);
    });
  }
  getManyUsersByEmail(emails) {
    return __async(this, null, function* () {
      return this.users.filter((u) => emails.includes(u.email));
    });
  }
  changePassword(data) {
    return __async(this, null, function* () {
      const userIndex = this.users.findIndex((u) => u.email === data.email);
      if (userIndex !== -1) {
        this.users[userIndex] = __spreadProps(__spreadValues({}, this.users[userIndex]), {
          password: data.password || ""
        });
      }
    });
  }
  getAllUsers() {
    return __async(this, null, function* () {
      return this.users;
    });
  }
};

// src/repository/in-memory/in-memory-task-repository.ts
var InMemoryTaskRepository = class {
  constructor() {
    this.tasks = [];
  }
  findById(taskId) {
    return __async(this, null, function* () {
      const task = this.tasks.find((task2) => task2.id === taskId);
      return task || null;
    });
  }
  delete(taskId) {
    return __async(this, null, function* () {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
    });
  }
  create(data) {
    return __async(this, null, function* () {
      const newTask = {
        id: "1",
        title: data.title,
        information: data.information || "",
        status: data.status || "To_Do",
        projectId: data.projectId,
        responsibleId: data.responsibleId,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        files: ""
      };
      this.tasks.push(newTask);
      return newTask;
    });
  }
  updateStatus(taskId, status) {
    return __async(this, null, function* () {
      const task = this.tasks.find((task2) => task2.id === taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      task.status = status;
      task.updatedAt = /* @__PURE__ */ new Date();
      return task;
    });
  }
};

// src/use-cases/cases/task/delete.spec.ts
var mockTask;
var sut;
var taskRepository;
var userRepository;
var projectRepository;
(0, import_vitest.describe)("Delete Task Use Case", () => {
  (0, import_vitest.beforeEach)(() => __async(exports, null, function* () {
    taskRepository = new InMemoryTaskRepository();
    userRepository = new InMemoryUserRepository();
    projectRepository = new InMemoryProjectRepository();
    sut = new DeleteTaskUseCase(taskRepository, userRepository);
    mockTask = yield createMockTask(
      userRepository,
      projectRepository,
      taskRepository
    );
  }));
  (0, import_vitest.it)("should be able to delete a task", () => __async(exports, null, function* () {
    const result = yield sut.execute(mockTask.id, mockTask.responsibleId);
    const deletedTask = yield taskRepository.findById(mockTask.id);
    (0, import_vitest.expect)(result).toEqual({ message: "Task deleted successfully" });
    (0, import_vitest.expect)(deletedTask).toBeNull();
  }));
  (0, import_vitest.it)("should not be able to delete a task if user does not exist", () => __async(exports, null, function* () {
    yield (0, import_vitest.expect)(
      sut.execute(mockTask.id, "nonexistent-user-id")
    ).rejects.toBeInstanceOf(ErrorHandler);
  }));
  (0, import_vitest.it)("should not be able to delete a task if task does not exist", () => __async(exports, null, function* () {
    yield (0, import_vitest.expect)(
      sut.execute("nonexistent-task-id", "user-id")
    ).rejects.toBeInstanceOf(ErrorHandler);
  }));
});
