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

// src/use-cases/cases/project/update-status-privacy.spec.ts
var import_bcryptjs = require("bcryptjs");
var import_vitest = require("vitest");

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/project/update-status-privacy.ts
var UpdateStatusPrivacyProjectUseCase = class {
  constructor(projectRepository2, userRepository2) {
    this.projectRepository = projectRepository2;
    this.userRepository = userRepository2;
  }
  execute(projectId, ownerId, statusPrivacy) {
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
      const updatedProject = yield this.projectRepository.updateStatus(
        projectId,
        statusPrivacy
      );
      return updatedProject;
    });
  }
};

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

// src/use-cases/cases/project/update-status-privacy.spec.ts
var import_client = require("@prisma/client");
var userRepository;
var projectRepository;
var sut;
(0, import_vitest.describe)("Update Status Privacy Project Use Case", () => {
  (0, import_vitest.beforeEach)(() => {
    projectRepository = new InMemoryProjectRepository();
    userRepository = new InMemoryUserRepository();
    sut = new UpdateStatusPrivacyProjectUseCase(
      projectRepository,
      userRepository
    );
  });
  (0, import_vitest.it)("should be able to update project status privacy", () => __async(exports, null, function* () {
    const { id: ownerId } = yield userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: yield (0, import_bcryptjs.hash)("123456", 6)
    });
    const project = yield projectRepository.create({
      color: "green",
      name: "Project 1",
      privacy: import_client.Privacy.Public,
      ownerId,
      usersIds: [ownerId]
    });
    const updatedProject = yield sut.execute(
      project.id,
      ownerId,
      import_client.Privacy.Private
    );
    (0, import_vitest.expect)(updatedProject.privacy).toBe(import_client.Privacy.Private);
  }));
  (0, import_vitest.it)("should not be able to update project status privacy with wrong owner id", () => __async(exports, null, function* () {
    const { id: ownerId } = yield userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: yield (0, import_bcryptjs.hash)("123456", 6)
    });
    const { id: otherUserId } = yield userRepository.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: yield (0, import_bcryptjs.hash)("123456", 6)
    });
    const project = yield projectRepository.create({
      color: "green",
      name: "Project 1",
      privacy: import_client.Privacy.Public,
      ownerId,
      usersIds: [ownerId]
    });
    yield (0, import_vitest.expect)(
      () => sut.execute(project.id, otherUserId, import_client.Privacy.Private)
    ).rejects.toBeInstanceOf(ErrorHandler);
  }));
  (0, import_vitest.it)("should not be able to update status privacy of non-existent project", () => __async(exports, null, function* () {
    const { id: ownerId } = yield userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: yield (0, import_bcryptjs.hash)("123456", 6)
    });
    yield (0, import_vitest.expect)(
      () => sut.execute("non-existent-project-id", ownerId, import_client.Privacy.Private)
    ).rejects.toThrow("Project does not exist");
  }));
  (0, import_vitest.it)("should not be able to update status privacy with non-existent owner", () => __async(exports, null, function* () {
    const { id: ownerId } = yield userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: yield (0, import_bcryptjs.hash)("123456", 6)
    });
    const project = yield projectRepository.create({
      color: "green",
      name: "Project 1",
      privacy: import_client.Privacy.Public,
      ownerId,
      usersIds: [ownerId]
    });
    yield userRepository.deleteUser({ email: "johndoe@example.com" });
    yield (0, import_vitest.expect)(
      () => sut.execute(project.id, ownerId, import_client.Privacy.Private)
    ).rejects.toBeInstanceOf(ErrorHandler);
  }));
});
