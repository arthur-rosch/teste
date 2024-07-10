"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/use-cases/cases/project/create.spec.ts
var import_bcryptjs = require("bcryptjs");

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/project/create.ts
var CreateProjectUseCase = class {
  constructor(notificationRepository2, notificationService2, projectRepository2, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.projectRepository = projectRepository2;
    this.userRepository = userRepository2;
  }
  execute(data) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(data.ownerId);
      if (!owner) {
        throw new ErrorHandler(400, "User not found, try again");
      }
      for (const element of data.usersIds) {
        const user = yield this.userRepository.getUserById(element);
        if (!user) {
          throw new ErrorHandler(400, "Added user does not exist");
        }
        const notificationParams2 = {
          userId: element,
          senderId: data.ownerId,
          message: `${owner.name} convidou voc\xEA para o projeto ${data.name}`
        };
        const notification2 = yield this.notificationRepository.create(notificationParams2);
        yield this.notificationService.send(notification2);
      }
      const notificationParams = {
        userId: data.ownerId,
        senderId: data.ownerId,
        message: `Voc\xEA acabou de criar o projeto ${data.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      const newProject = yield this.projectRepository.create(data);
      return newProject;
    });
  }
};

// src/use-cases/cases/project/create.spec.ts
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

// src/repository/in-memory/in-memory-notification-repository.ts
var InMemoryNotificationRepository = class {
  constructor() {
    this.notifications = [];
  }
  create(data) {
    return __async(this, null, function* () {
      const newNotification = __spreadProps(__spreadValues({}, data), {
        id: (this.notifications.length + 1).toString()
      });
      this.notifications.push(newNotification);
      return newNotification;
    });
  }
  getUserId(userId) {
    return __async(this, null, function* () {
      return this.notifications.find(
        (notification) => notification.userId === userId
      ) || null;
    });
  }
  updateReadyNotification(notificationId, ready) {
    return __async(this, null, function* () {
      const notification = this.notifications.find(
        (notification2) => notification2.id === notificationId
      );
      notification.isRead = ready;
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

// src/use-cases/cases/project/create.spec.ts
var notificationRepository;
var notificationService;
var userRepository;
var projectRepository;
var sut;
(0, import_vitest.describe)("Create Project Use Case", () => {
  (0, import_vitest.beforeEach)(() => {
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
  (0, import_vitest.it)("should be able to create project", () => __async(exports, null, function* () {
    const { id } = yield userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: yield (0, import_bcryptjs.hash)("123456", 6)
    });
    const project = yield sut.execute({
      color: "green",
      name: "Project 1",
      privacy: "Public",
      ownerId: id,
      usersIds: [id]
    });
    (0, import_vitest.expect)(project.id).toBeTruthy();
  }));
  (0, import_vitest.it)("should not be able to create with wrong id", () => __async(exports, null, function* () {
    yield (0, import_vitest.expect)(
      () => sut.execute({
        color: "green",
        name: "Project 1",
        privacy: "Public",
        ownerId: "10",
        usersIds: ["10"]
      })
    ).rejects.toBeInstanceOf(ErrorHandler);
  }));
});
