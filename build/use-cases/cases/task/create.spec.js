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

// src/lib/change.ts
var import_chance = __toESM(require("chance"));
var chance = new import_chance.default();

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};
var handleError = (err, req, res, next) => {
  if (err instanceof import_zod.ZodError) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation error",
      errors: err.errors.map((e) => ({
        path: e.path,
        message: e.message
      }))
    });
    return;
  }
  const { statusCode, message } = err;
  res.status(statusCode || 500).json({
    status: "error",
    statusCode,
    message
  });
};

// src/use-cases/cases/task/create.ts
var CreateTaskUseCase = class {
  constructor(notificationRepository2, notificationService2, taskRepository2, projectRepository2, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.taskRepository = taskRepository2;
    this.projectRepository = projectRepository2;
    this.userRepository = userRepository2;
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

// src/use-cases/cases/task/create.spec.ts
var import_vitest = require("vitest");

// src/utils/test/mock-user.ts
var import_chance2 = __toESM(require("chance"));
var import_bcryptjs = require("bcryptjs");
var chance2 = new import_chance2.default();
function createMockUser(userRepository2) {
  return __async(this, null, function* () {
    const name = chance2.name();
    const email = chance2.email();
    const password = yield (0, import_bcryptjs.hash)(chance2.string({ length: 8 }), 6);
    return yield userRepository2.create({
      name,
      email,
      password
    });
  });
}

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

// src/index.ts
var import_cors = __toESM(require("cors"));
var import_axios = __toESM(require("axios"));
var import_http = require("http");

// src/routes/route.ts
var import_express = require("express");

// src/http/middleware/authenticateUser.ts
var import_jsonwebtoken = require("jsonwebtoken");
function authenticateUser(req, res, next) {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(403).json({ msg: "Token is missing" });
  }
  const [, token] = authToken.split(" ");
  if (!token) {
    return res.status(403).json({ msg: "Token format is invalid" });
  }
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    return res.status(500).json({ msg: "Key is not defined" });
  }
  try {
    (0, import_jsonwebtoken.verify)(token, secretKey);
    return next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is invalid" });
  }
}

// src/use-cases/factories/user/edit-user.ts
var import_client2 = require("@prisma/client");

// src/repository/prisma/prisma-user-repository.ts
var UserRepository = class {
  constructor(prisma3) {
    this.prisma = prisma3;
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
      const createUser2 = yield this.prisma.user.create({
        data: {
          name,
          email,
          phone,
          gender,
          dateBirth,
          password
        }
      });
      return createUser2;
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

// src/use-cases/cases/user/edit-user.ts
var EditUser = class {
  constructor(userRepository2) {
    this.userRepository = userRepository2;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email } = data;
      const userAlreadyExists = yield this.userRepository.getUser({
        email
      });
      if (!userAlreadyExists) {
        throw new ErrorHandler(400, "User not exists, try again");
      }
      const updateUser = {
        name: data.name || userAlreadyExists.name,
        email,
        phone: data.phone || userAlreadyExists.phone,
        gender: data.gender || userAlreadyExists.gender,
        dateBirth: data.dateBirth || userAlreadyExists.dateBirth
      };
      yield this.userRepository.editUser(updateUser);
      return updateUser;
    });
  }
};

// src/use-cases/factories/user/edit-user.ts
function makeEditUser() {
  const prisma3 = new import_client2.PrismaClient();
  const userRepository2 = new UserRepository(prisma3);
  const editUser2 = new EditUser(userRepository2);
  return editUser2;
}

// src/http/controller/user/edit-user.ts
var import_zod2 = require("zod");
function editUser(req, res, next) {
  return __async(this, null, function* () {
    try {
      const querySchema = import_zod2.z.object({
        name: import_zod2.z.string().optional(),
        email: import_zod2.z.string().email(),
        phone: import_zod2.z.string().optional(),
        gender: import_zod2.z.string().optional(),
        dateBirth: import_zod2.z.string().optional()
      });
      const data = querySchema.parse(req.body);
      const userusecase = makeEditUser();
      const newUser = yield userusecase.execute(data);
      res.status(200).send(newUser);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/factories/user/login-user.ts
var import_client3 = require("@prisma/client");

// src/use-cases/cases/user/login-user.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"));
var import_jsonwebtoken2 = require("jsonwebtoken");
var LoginUser = class {
  constructor(userRepository2, emailRepository) {
    this.userRepository = userRepository2;
    this.emailRepository = emailRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email, password } = data;
      const userAlreadyExists = yield this.userRepository.getUser({ email });
      if (!userAlreadyExists) {
        throw new ErrorHandler(400, "User not exists, try again");
      }
      const tokenAlreadyValid = yield this.emailRepository.checkEmailToken(email);
      if (!(tokenAlreadyValid == null ? void 0 : tokenAlreadyValid.validated)) {
        throw new ErrorHandler(400, "You need to validate your email to log in");
      }
      const passwordMatch = yield import_bcryptjs2.default.compare(
        password,
        userAlreadyExists.password
      );
      if (!passwordMatch) {
        throw new ErrorHandler(400, "Password is not equal");
      }
      const secrectKey = process.env.JWT_SECRET;
      if (!secrectKey) {
        throw new ErrorHandler(500, "Key is not defined");
      }
      const token = (0, import_jsonwebtoken2.sign)({}, secrectKey, {
        subject: email,
        expiresIn: process.env.JWT_EXPIRE
      });
      return { user: userAlreadyExists, token };
    });
  }
};

// src/repository/prisma/prisma-room-repository.ts
var RoomRepository = class {
  constructor(prisma3) {
    this.prisma = prisma3;
  }
  create(data) {
    return __async(this, null, function* () {
      const createRoom = yield this.prisma.room.create({
        data
      });
      return createRoom;
    });
  }
  getById(roomId) {
    return __async(this, null, function* () {
      const room = yield this.prisma.room.findUnique({
        where: {
          id: roomId
        }
      });
      return room;
    });
  }
  update(name, roomId) {
    return __async(this, null, function* () {
      yield this.prisma.room.update({
        where: {
          id: roomId
        },
        data: {
          name
        }
      });
    });
  }
  delete(roomId) {
    return __async(this, null, function* () {
      yield this.prisma.room.delete({
        where: {
          id: roomId
        }
      });
    });
  }
  addUserToChat(roomId, userId) {
    return __async(this, null, function* () {
      yield this.prisma.room.update({
        where: {
          id: roomId
        },
        data: {
          users: {
            connect: {
              id: userId
            }
          }
        }
      });
    });
  }
  removeUserFromChat(roomId, userId) {
    return __async(this, null, function* () {
      yield this.prisma.room.update({
        where: {
          id: roomId
        },
        data: {
          users: {
            disconnect: {
              id: userId
            }
          }
        }
      });
    });
  }
  createVideoRoom(ownerId, roomId, roomLink) {
    return __async(this, null, function* () {
      return yield this.prisma.videoRoom.create({
        data: {
          ownerId,
          roomId,
          roomLink
        }
      });
    });
  }
};

// src/repository/prisma/prisma-message-repository.ts
var MessageRepository = class {
  constructor(prisma3) {
    this.prisma = prisma3;
  }
  saveMessage(data) {
    return __async(this, null, function* () {
      const { content, userId, chatId } = data;
      yield this.prisma.message.create({
        data: {
          content,
          userId,
          chatId
        }
      });
    });
  }
  getMessagesByChatId(data) {
    return __async(this, null, function* () {
      const searchMessage = yield this.prisma.message.findMany({
        where: {
          chatId: data.chatId
        }
      });
      return searchMessage;
    });
  }
  getMessagesByUserId(data) {
    return __async(this, null, function* () {
      const searchMessage = yield this.prisma.message.findMany({
        where: {
          userId: data.userId
        }
      });
      return searchMessage;
    });
  }
  getAllMessages() {
    return __async(this, null, function* () {
      const allMessages = yield this.prisma.message.findMany();
      return allMessages;
    });
  }
  getChatId(data) {
    return __async(this, null, function* () {
      const getChatId = yield this.prisma.message.findFirst({
        where: {
          chatId: data.chatId
        }
      });
      return getChatId;
    });
  }
  getUserId(data) {
    return __async(this, null, function* () {
      const getUserId = yield this.prisma.message.findFirst({
        where: {
          userId: data.userId
        }
      });
      return getUserId;
    });
  }
};

// src/repository/prisma/prisma-emailToken-repository.ts
var EmailTokenRepository = class {
  constructor(prisma3) {
    this.prisma = prisma3;
  }
  create(data) {
    return __async(this, null, function* () {
      const { email, token, validated, attempts } = data;
      yield this.prisma.emailToken.create({
        data: {
          email,
          token,
          validated,
          attempts
        }
      });
    });
  }
  checkEmailToken(email) {
    return __async(this, null, function* () {
      const emailToken = this.prisma.emailToken.findFirst({
        where: {
          email
        }
      });
      return emailToken;
    });
  }
  deleteEmailToken(email) {
    return __async(this, null, function* () {
      yield this.prisma.emailToken.delete({
        where: {
          email
        }
      });
    });
  }
  updateAttemptsEmailToken(data) {
    return __async(this, null, function* () {
      yield this.prisma.emailToken.update({
        where: {
          email: data.email
        },
        data: {
          attempts: data.attempts
        }
      });
    });
  }
  updateEmailToken(data) {
    return __async(this, null, function* () {
      const { email, validated } = data;
      yield this.prisma.emailToken.update({
        where: {
          email
        },
        data: {
          validated
        }
      });
    });
  }
};

// src/repository/prisma/prisma-notification-repository.ts
var NotificationRepository = class {
  constructor(prisma3) {
    this.prisma = prisma3;
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

// src/use-cases/factories/user/login-user.ts
function makeLoginUser() {
  const prisma3 = new import_client3.PrismaClient();
  const userRepository2 = new UserRepository(prisma3);
  const emailRepository = new EmailTokenRepository(prisma3);
  const loginUser2 = new LoginUser(userRepository2, emailRepository);
  return loginUser2;
}

// src/http/controller/user/login-user.ts
var import_zod3 = require("zod");
function loginUser(req, res, next) {
  return __async(this, null, function* () {
    try {
      const querySchema = import_zod3.z.object({
        email: import_zod3.z.string().email(),
        password: import_zod3.z.string().min(6)
      });
      const { email, password } = querySchema.parse(req.body);
      const userusecase = makeLoginUser();
      const auth = yield userusecase.execute({ email, password });
      res.status(200).send(auth);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/factories/user/create-user.ts
var import_client4 = require("@prisma/client");

// src/use-cases/cases/user/create-user.ts
var import_bcryptjs3 = __toESM(require("bcryptjs"));
var import_chance4 = __toESM(require("chance"));
var chance4 = new import_chance4.default();
var CreateUser = class {
  constructor(userRepository2, emailService, emailRepository) {
    this.userRepository = userRepository2;
    this.emailService = emailService;
    this.emailRepository = emailRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email, password, confirmPassword } = data;
      const userAlreadyExists = yield this.userRepository.getUser({
        email
      });
      if (userAlreadyExists) {
        throw new ErrorHandler(400, "User exists, try again");
      }
      const comparePassword = password === confirmPassword;
      if (!comparePassword) {
        throw new ErrorHandler(400, "Password is not equal");
      }
      const newUser = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateBirth: data.dateBirth,
        password: yield import_bcryptjs3.default.hash(password, 8)
      };
      const token = chance4.string({ numeric: true, length: 5 });
      yield this.emailService.send(email, token);
      const createdUser = yield this.userRepository.create(newUser);
      const saveEmailToken = {
        email,
        token,
        validated: false,
        attempts: 0
      };
      yield this.emailRepository.create(saveEmailToken);
      return { user: createdUser };
    });
  }
};

// src/service/sendEmail.ts
var import_nodemailer = __toESM(require("nodemailer"));
var SendEmailToken = class {
  send(email, token) {
    return __async(this, null, function* () {
      const transporter = import_nodemailer.default.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: parseInt(process.env.NODEMAILER_HOST),
        secure: true,
        auth: {
          user: process.env.NODEMAILER_AUTH_USER,
          pass: process.env.NODEMAILER_AUTH_PASS
        }
      });
      yield transporter.sendMail({
        from: process.env.NODEMAILER_AUTH_USER,
        to: email,
        subject: "Verifica\xE7\xE3o de posse de e-mail",
        text: `Esse \xE9 seu token de valida\xE7\xE3o: ${token}`,
        html: `<p>Esse \xE9 seu token de valida\xE7\xE3o: ${token}</p>`
      }).then(() => console.log("E-mail enviado com sucesso")).catch((error) => {
        if (error) {
          new ErrorHandler(400, "Email sending failed, please try again");
        }
      });
    });
  }
};

// src/use-cases/factories/user/create-user.ts
function makeCreateUser() {
  const prisma3 = new import_client4.PrismaClient();
  const userRepository2 = new UserRepository(prisma3);
  const emailService = new SendEmailToken();
  const emailRepository = new EmailTokenRepository(prisma3);
  const createUser2 = new CreateUser(
    userRepository2,
    emailService,
    emailRepository
  );
  return createUser2;
}

// src/http/controller/user/create-user.ts
var import_zod4 = require("zod");
function createUser(req, res, next) {
  return __async(this, null, function* () {
    try {
      const querySchema = import_zod4.z.object({
        name: import_zod4.z.string(),
        email: import_zod4.z.string().email(),
        phone: import_zod4.z.string(),
        gender: import_zod4.z.string(),
        dateBirth: import_zod4.z.string(),
        password: import_zod4.z.string().min(6),
        confirmPassword: import_zod4.z.string().min(6)
      });
      const data = querySchema.parse(req.body);
      const userusecase = makeCreateUser();
      const createUser2 = yield userusecase.execute(data);
      res.status(200).send(createUser2);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/factories/user/delete-user.ts
var import_client5 = require("@prisma/client");

// src/use-cases/cases/user/delete-user.ts
var DeleteUser = class {
  constructor(userRepository2, emailRepository) {
    this.userRepository = userRepository2;
    this.emailRepository = emailRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email } = data;
      const userAlreadyExists = yield this.userRepository.getUser({ email });
      const emailTokelAlreadyExist = yield this.emailRepository.checkEmailToken(email);
      if (emailTokelAlreadyExist) {
        yield this.emailRepository.deleteEmailToken(email);
      }
      if (!userAlreadyExists) {
        throw new ErrorHandler(400, "User not exists, try again");
      }
      yield this.userRepository.deleteUser({ email });
    });
  }
};

// src/use-cases/factories/user/delete-user.ts
function makeDeleteUser() {
  const prisma3 = new import_client5.PrismaClient();
  const emailRepository = new EmailTokenRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  const deleteUser2 = new DeleteUser(userRepository2, emailRepository);
  return deleteUser2;
}

// src/http/controller/user/delete-user.ts
var import_zod5 = require("zod");
function deleteUser(req, res, next) {
  return __async(this, null, function* () {
    const querySchema = import_zod5.z.object({
      email: import_zod5.z.string().email()
    });
    try {
      const { email } = querySchema.parse(req.body);
      const userusecase = makeDeleteUser();
      yield userusecase.execute({ email });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/factories/user/get-user.ts
var import_client6 = require("@prisma/client");

// src/use-cases/cases/user/get-user.ts
var GetUser = class {
  constructor(userRepository2) {
    this.userRepository = userRepository2;
  }
  execute() {
    return __async(this, null, function* () {
      const users = yield this.userRepository.getAllUsers();
      if (!users) {
        throw new ErrorHandler(400, "Not registered users");
      }
      const returnUsers = users.map(({ id, name, email }) => ({
        id,
        name,
        email
      }));
      return returnUsers;
    });
  }
};

// src/use-cases/factories/user/get-user.ts
function makeGetUser() {
  const prisma3 = new import_client6.PrismaClient();
  const userRepository2 = new UserRepository(prisma3);
  return new GetUser(userRepository2);
}

// src/http/controller/user/get-users.ts
function getUsers(req, res, next) {
  return __async(this, null, function* () {
    try {
      const userUsecase = makeGetUser();
      const users = yield userUsecase.execute();
      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  });
}

// src/http/controller/room/create.ts
var z5 = __toESM(require("zod"));

// src/use-cases/factories/room/make-create-room.ts
var import_client7 = require("@prisma/client");

// src/use-cases/cases/room/create.ts
var CreateRoomUseCase = class {
  constructor(notificationRepository2, notificationService2, roomRepository, userRepository2, chatRepository) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.roomRepository = roomRepository;
    this.userRepository = userRepository2;
    this.chatRepository = chatRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(data.ownerId);
      if (!owner) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const createdRoom = yield this.roomRepository.create(data);
      yield this.chatRepository.create({
        roomId: createdRoom.id
      });
      const notificationParams = {
        userId: owner.id,
        senderId: owner.id,
        message: `Voc\xEA acabou de criar a sala ${data.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      return createdRoom;
    });
  }
};

// src/repository/prisma/prisma-chat-repository.ts
var ChatRepository = class {
  constructor(prisma3) {
    this.prisma = prisma3;
  }
  delete(chatId) {
    return __async(this, null, function* () {
      yield this.prisma.chat.delete({
        where: {
          id: chatId
        }
      });
    });
  }
  create(data) {
    return __async(this, null, function* () {
      const createChat = yield this.prisma.chat.create({
        data
      });
      return createChat;
    });
  }
  getById(id) {
    return __async(this, null, function* () {
      const chat = yield this.prisma.chat.findFirst({
        where: {
          id
        }
      });
      return chat;
    });
  }
  getByRoomId(chatRoomId) {
    return __async(this, null, function* () {
      const chatRoom = yield this.prisma.chat.findFirst({
        where: {
          roomId: chatRoomId
        }
      });
      return chatRoom;
    });
  }
};

// src/use-cases/factories/room/make-create-room.ts
function makeCreateRoomUseCase() {
  const prisma3 = new import_client7.PrismaClient();
  const notificationRepository2 = new NotificationRepository(prisma3);
  const notificationService2 = new SendNotification();
  const roomRepository = new RoomRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  const chatRepository = new ChatRepository(prisma3);
  return new CreateRoomUseCase(notificationRepository2, notificationService2, roomRepository, userRepository2, chatRepository);
}

// src/http/controller/room/create.ts
var createRoomController = (req, res, next) => __async(void 0, null, function* () {
  const CreateRoomRequestSchema = z5.object({
    name: z5.string().min(3).max(50),
    user_id: z5.string()
  });
  try {
    const { name, user_id } = CreateRoomRequestSchema.parse(req.body);
    const createRoomUseCase = makeCreateRoomUseCase();
    const createdRoom = yield createRoomUseCase.execute({
      name,
      ownerId: user_id
    });
    res.status(201).json(createdRoom);
  } catch (error) {
    next(error);
  }
});

// src/use-cases/factories/room/make-delete-room.ts
var import_client8 = require("@prisma/client");

// src/use-cases/cases/room/delete.ts
var DeleteRoomUseCase = class {
  constructor(notificationRepository2, notificationService2, chatRepository, roomRepository, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.chatRepository = chatRepository;
    this.roomRepository = roomRepository;
    this.userRepository = userRepository2;
  }
  execute(roomId, userId) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(userId);
      if (!owner) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const existingRoom = yield this.roomRepository.getById(roomId);
      if (!existingRoom) {
        throw new ErrorHandler(400, "Room Not Found, try again");
      }
      if (existingRoom.ownerId !== owner.id) {
        throw new ErrorHandler(
          400,
          "Unauthorized, Only owner can delete the Room"
        );
      }
      const { id } = yield this.chatRepository.getByRoomId(roomId);
      const notificationParams = {
        userId: owner.id,
        senderId: owner.id,
        message: `Voc\xEA acabou de deletar a sala ${existingRoom.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      yield this.chatRepository.delete(id);
      yield this.roomRepository.delete(roomId);
    });
  }
};

// src/use-cases/factories/room/make-delete-room.ts
function makeDeleteRoomUseCase() {
  const prisma3 = new import_client8.PrismaClient();
  const notificationRepository2 = new NotificationRepository(prisma3);
  const notificationService2 = new SendNotification();
  const userRepository2 = new UserRepository(prisma3);
  const roomRepository = new RoomRepository(prisma3);
  const chatRepository = new ChatRepository(prisma3);
  return new DeleteRoomUseCase(notificationRepository2, notificationService2, chatRepository, roomRepository, userRepository2);
}

// src/http/controller/room/delete.ts
var import_zod6 = require("zod");
var deleteRoomController = (req, res, next) => __async(void 0, null, function* () {
  const paramsSchema = import_zod6.z.object({
    roomId: import_zod6.z.string()
  });
  const bodySchema = import_zod6.z.object({
    user_id: import_zod6.z.string()
  });
  try {
    const { user_id } = bodySchema.parse(req.body);
    const { roomId } = paramsSchema.parse(req.params);
    const deleteRoomUseCase = makeDeleteRoomUseCase();
    yield deleteRoomUseCase.execute(roomId, user_id);
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// src/http/controller/room/update.ts
var z7 = __toESM(require("zod"));

// src/use-cases/factories/room/make-update-room.ts
var import_client9 = require("@prisma/client");

// src/use-cases/cases/room/update.ts
var UpdateRoomUseCase = class {
  constructor(roomRepository, userRepository2) {
    this.roomRepository = roomRepository;
    this.userRepository = userRepository2;
  }
  execute(name, roomId, userId) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(userId);
      if (!owner) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const existingRoom = yield this.roomRepository.getById(roomId);
      if (!existingRoom) {
        throw new ErrorHandler(400, "Room Not Found, try again");
      }
      if (existingRoom.ownerId !== owner.id) {
        throw new ErrorHandler(
          400,
          "Unauthorized, Only owner can update the Room"
        );
      }
      yield this.roomRepository.update(name, roomId);
    });
  }
};

// src/use-cases/factories/room/make-update-room.ts
function makeUpdateRoomUseCase() {
  const prisma3 = new import_client9.PrismaClient();
  const userRepository2 = new UserRepository(prisma3);
  const roomRepository = new RoomRepository(prisma3);
  return new UpdateRoomUseCase(roomRepository, userRepository2);
}

// src/http/controller/room/update.ts
var updateRoomController = (req, res, next) => __async(void 0, null, function* () {
  const updateRoomRequestSchema = z7.object({
    name: z7.string().min(3).max(50),
    ownerId: z7.string(),
    roomId: z7.string()
  });
  try {
    const { name, roomId, ownerId } = updateRoomRequestSchema.parse(req.body);
    const updateRoomUseCase = makeUpdateRoomUseCase();
    yield updateRoomUseCase.execute(name, roomId, ownerId);
    res.status(200).json({ message: "Room updated successfully" });
  } catch (error) {
    next(error);
  }
});

// src/use-cases/factories/room/make-find-by-id.ts
var import_client10 = require("@prisma/client");

// src/use-cases/cases/room/get-by-id.ts
var GetRoomByIdUseCase = class {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }
  execute(roomId) {
    return __async(this, null, function* () {
      const room = yield this.roomRepository.getById(roomId);
      if (!room) {
        throw new ErrorHandler(400, "Room Not Found, try again");
      }
      return room;
    });
  }
};

// src/use-cases/factories/room/make-find-by-id.ts
function makeGetRoomByIdUseCase() {
  const prisma3 = new import_client10.PrismaClient();
  const roomRepository = new RoomRepository(prisma3);
  return new GetRoomByIdUseCase(roomRepository);
}

// src/http/controller/room/get-by-id.ts
var import_zod7 = require("zod");
var getRoomByIdController = (req, res, next) => __async(void 0, null, function* () {
  const paramsSchema = import_zod7.z.object({
    roomId: import_zod7.z.string()
  });
  try {
    const { roomId } = paramsSchema.parse(req.params);
    const getRoomByIdUseCase = makeGetRoomByIdUseCase();
    const room = yield getRoomByIdUseCase.execute(roomId);
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
});

// src/http/controller/room/add-user-to-room.ts
var z9 = __toESM(require("zod"));

// src/use-cases/factories/room/make-add-user-to-room.ts
var import_client11 = require("@prisma/client");

// src/use-cases/cases/room/add-user-to-chat-room.ts
var AddUserToRoomUseCase = class {
  constructor(notificationRepository2, notificationService2, roomRepository, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.roomRepository = roomRepository;
    this.userRepository = userRepository2;
  }
  execute(roomId, userId, ownerId) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(ownerId);
      if (!owner) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const existingRoom = yield this.roomRepository.getById(roomId);
      if (!existingRoom) {
        throw new ErrorHandler(400, "Room Not Found, try again");
      }
      const userExists = yield this.userRepository.getUserById(userId);
      if (!userExists) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      if (owner.id !== existingRoom.ownerId) {
        throw new ErrorHandler(
          400,
          "Unauthorized, Only owner can added the Chat Room"
        );
      }
      yield this.roomRepository.addUserToChat(roomId, userId);
      const notificationParams = {
        userId,
        senderId: ownerId,
        message: `Voc\xEA foi adicionado a sala ${existingRoom.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
    });
  }
};

// src/use-cases/factories/room/make-add-user-to-room.ts
function makeAddUserToRoomUseCase() {
  const prisma3 = new import_client11.PrismaClient();
  const notificationRepository2 = new NotificationRepository(prisma3);
  const notificationService2 = new SendNotification();
  const roomRepository = new RoomRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  return new AddUserToRoomUseCase(
    notificationRepository2,
    notificationService2,
    roomRepository,
    userRepository2
  );
}

// src/http/controller/room/add-user-to-room.ts
var addUserToRoomController = (req, res, next) => __async(void 0, null, function* () {
  const AddUserToRoomRequestSchema = z9.object({
    roomId: z9.string(),
    addUserId: z9.string(),
    ownerId: z9.string()
  });
  try {
    const { roomId, addUserId, ownerId } = AddUserToRoomRequestSchema.parse(
      req.body
    );
    const addUserToRoomUseCase = makeAddUserToRoomUseCase();
    yield addUserToRoomUseCase.execute(roomId, addUserId, ownerId);
    res.status(200).json({ message: "User added to room successfully" });
  } catch (error) {
    next(error);
  }
});

// src/use-cases/cases/room/add-video-room.ts
var AddVideoRoomUseCase = class {
  constructor(roomRepository, userRepository2) {
    this.roomRepository = roomRepository;
    this.userRepository = userRepository2;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { ownerId, roomId, roomLink } = data;
      const ownerAlreadyExists = yield this.userRepository.getUserById(ownerId);
      if (!ownerAlreadyExists) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const roomExists = yield this.roomRepository.getById(roomId);
      if (!roomExists) {
        throw new ErrorHandler(400, "Room Not Found, try again");
      }
      const videoRoom = this.roomRepository.createVideoRoom(
        ownerId,
        roomId,
        roomLink
      );
      return videoRoom;
    });
  }
};

// src/use-cases/factories/room/make-add-video-room.ts
var import_client12 = require("@prisma/client");
function makeAddVideoRoom() {
  const prisma3 = new import_client12.PrismaClient();
  const roomRepository = new RoomRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  return new AddVideoRoomUseCase(roomRepository, userRepository2);
}

// src/http/controller/room/add-video-room.ts
var import_zod8 = require("zod");
function addVideoRoom(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod8.z.object({
        ownerId: import_zod8.z.string(),
        roomId: import_zod8.z.string(),
        roomLink: import_zod8.z.string()
      });
      const data = bodySchema.parse(req.body);
      const roomUseCase = makeAddVideoRoom();
      const result = yield roomUseCase.execute(data);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  });
}

// src/http/controller/room/remove-user-to-room.ts
var z11 = __toESM(require("zod"));

// src/use-cases/factories/room/make-remove-user-to-room.ts
var import_client13 = require("@prisma/client");

// src/use-cases/cases/room/remove-user-to-chat-room.ts
var RemoveUserToRoomUseCase = class {
  constructor(notificationRepository2, notificationService2, roomRepository, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.roomRepository = roomRepository;
    this.userRepository = userRepository2;
  }
  execute(roomId, userId, ownerId) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(ownerId);
      if (!owner) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const existingRoom = yield this.roomRepository.getById(roomId);
      if (!existingRoom) {
        throw new ErrorHandler(400, "Room Not Found, try again");
      }
      const userExists = yield this.userRepository.getUserById(userId);
      if (!userExists) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      if (existingRoom.ownerId !== owner.id) {
        throw new ErrorHandler(
          400,
          "Unauthorized, Only owner can delete the Room"
        );
      }
      yield this.roomRepository.removeUserFromChat(roomId, userId);
      const notificationParams = {
        userId,
        senderId: ownerId,
        message: `Voc\xEA foi removido da sala ${existingRoom.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
    });
  }
};

// src/use-cases/factories/room/make-remove-user-to-room.ts
function makeRemoveUserToRoomUseCase() {
  const prisma3 = new import_client13.PrismaClient();
  const notificationRepository2 = new NotificationRepository(prisma3);
  const notificationService2 = new SendNotification();
  const userRepository2 = new UserRepository(prisma3);
  const roomRepository = new RoomRepository(prisma3);
  return new RemoveUserToRoomUseCase(
    notificationRepository2,
    notificationService2,
    roomRepository,
    userRepository2
  );
}

// src/http/controller/room/remove-user-to-room.ts
var removeUserToRoomController = (req, res, next) => __async(void 0, null, function* () {
  const RemoveUserToRoomRequestSchema = z11.object({
    roomId: z11.string(),
    removeUserId: z11.string(),
    ownerId: z11.string()
  });
  try {
    const { roomId, removeUserId, ownerId } = RemoveUserToRoomRequestSchema.parse(req.body);
    const removeUserToRoomUseCase = makeRemoveUserToRoomUseCase();
    yield removeUserToRoomUseCase.execute(roomId, removeUserId, ownerId);
    res.status(200).json({ message: "User removed to room successfully" });
  } catch (error) {
    next(error);
  }
});

// src/use-cases/cases/message/send-message.ts
var SendMessage = class {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({ chatId, content, userId }) {
      io.emit("sendMessage", content);
      yield this.messageRepository.saveMessage({
        content,
        userId,
        chatId
      });
    });
  }
};

// src/use-cases/factories/message/send-message.ts
var import_client14 = require("@prisma/client");
function makeSendMessage() {
  const prisma3 = new import_client14.PrismaClient();
  const userRepository2 = new MessageRepository(prisma3);
  const sendMessage2 = new SendMessage(userRepository2);
  return sendMessage2;
}

// src/http/controller/message/send-message.ts
var import_zod9 = require("zod");
function sendMessage(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod9.z.object({
        chatId: import_zod9.z.string(),
        userId: import_zod9.z.string(),
        content: import_zod9.z.string()
      });
      const { content, chatId, userId } = bodySchema.parse(req.body);
      const messageusecase = makeSendMessage();
      yield messageusecase.execute({
        content,
        chatId,
        userId
      });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/cases/message/get-all-messages.ts
var GetAllMessages = class {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }
  execute() {
    return __async(this, null, function* () {
      const allMessages = yield this.messageRepository.getAllMessages();
      return allMessages;
    });
  }
};

// src/use-cases/factories/message/get-all-messages.ts
var import_client15 = require("@prisma/client");
function makeGetAllMessages() {
  const prisma3 = new import_client15.PrismaClient();
  const userRepository2 = new MessageRepository(prisma3);
  const getAllMessages2 = new GetAllMessages(userRepository2);
  return getAllMessages2;
}

// src/http/controller/message/get-all-messages.ts
function getAllMessages(req, res, next) {
  return __async(this, null, function* () {
    try {
      const messageusecase = makeGetAllMessages();
      const allMessages = yield messageusecase.execute();
      res.status(200).send(allMessages);
    } catch (error) {
      next(error);
    }
  });
}

// src/http/controller/message/get-messages-by-chatId.ts
var import_zod10 = require("zod");

// src/use-cases/cases/message/get-messages-by-chatId.ts
var GetMessagesByChatId = class {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { chatId } = data;
      const chatIdExists = yield this.messageRepository.getChatId({ chatId });
      if (!chatIdExists) {
        throw new ErrorHandler(400, "chatId not exists");
      }
      const allMessagesChat = yield this.messageRepository.getMessagesByChatId({
        chatId
      });
      return allMessagesChat;
    });
  }
};

// src/use-cases/factories/message/get-messages-by-chatId.ts
var import_client16 = require("@prisma/client");
function makeGetMessagesByChatId() {
  const prisma3 = new import_client16.PrismaClient();
  const userRepository2 = new MessageRepository(prisma3);
  const sendMessage2 = new GetMessagesByChatId(userRepository2);
  return sendMessage2;
}

// src/http/controller/message/get-messages-by-chatId.ts
function getMessagesByChatId(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod10.z.object({
        chatId: import_zod10.z.string()
      });
      const { chatId } = bodySchema.parse(req.params);
      const getMessageByChatId = makeGetMessagesByChatId();
      const messagesByUser = yield getMessageByChatId.execute({ chatId });
      res.status(200).send(messagesByUser);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/cases/message/get-messages-by-userId.ts
var GetMessagesByUserId = class {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { userId } = data;
      const userIdExists = yield this.messageRepository.getUserId({ userId });
      if (!userIdExists) {
        throw new ErrorHandler(400, "userId not exists");
      }
      const allMessagesChat = yield this.messageRepository.getMessagesByUserId({
        userId
      });
      return allMessagesChat;
    });
  }
};

// src/use-cases/factories/message/get-messages-by-userId.ts
var import_client17 = require("@prisma/client");
function makeGetMessagesByUserId() {
  const prisma3 = new import_client17.PrismaClient();
  const userRepository2 = new MessageRepository(prisma3);
  const sendMessage2 = new GetMessagesByUserId(userRepository2);
  return sendMessage2;
}

// src/http/controller/message/get-messages-by-userId.ts
var import_zod11 = require("zod");
function getMessagesByUserId(req, res, next) {
  return __async(this, null, function* () {
    try {
      const paramSchema = import_zod11.z.object({
        userId: import_zod11.z.string()
      });
      const { userId } = paramSchema.parse(req.params);
      const getMessageByChatId = makeGetMessagesByUserId();
      const messagesByUser = yield getMessageByChatId.execute({ userId });
      res.status(200).send(messagesByUser);
    } catch (error) {
      next(error);
    }
  });
}

// src/repository/prisma/prisma-annotation-repository.ts
var AnnotationRepository = class {
  constructor(prisma3) {
    this.prisma = prisma3;
  }
  delete(annotationId) {
    return __async(this, null, function* () {
      const annotationDeleted = yield this.prisma.annotation.delete({
        where: {
          id: annotationId
        }
      });
      return annotationDeleted;
    });
  }
  getByUserId(userId) {
    return __async(this, null, function* () {
      return yield this.prisma.annotation.findMany({
        where: {
          userId
        }
      });
    });
  }
  getById(id) {
    return __async(this, null, function* () {
      return yield this.prisma.annotation.findUnique({
        where: {
          id
        }
      });
    });
  }
  create(data) {
    return __async(this, null, function* () {
      const annotation = yield this.prisma.annotation.create({
        data
      });
      return annotation;
    });
  }
};

// src/use-cases/cases/annotation/create.ts
var CreateAnnotationUseCase = class {
  constructor(notificationRepository2, notificationService2, annotationRepository, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.annotationRepository = annotationRepository;
    this.userRepository = userRepository2;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      color,
      information,
      title,
      userId
    }) {
      const user = yield this.userRepository.getUserById(userId);
      if (!user) {
        throw new ErrorHandler(400, "User not found, try again");
      }
      const annotation = yield this.annotationRepository.create({
        color,
        information,
        title,
        userId
      });
      const notificationParams = {
        userId,
        senderId: userId,
        message: `Voc\xEA acabou de criar uma anota\xE7\xE3o`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      return annotation;
    });
  }
};

// src/use-cases/factories/annotation/create.ts
var import_client18 = require("@prisma/client");
function makeCreateAnnotation() {
  const prisma3 = new import_client18.PrismaClient();
  const notificationRepository2 = new NotificationRepository(prisma3);
  const notificationService2 = new SendNotification();
  const annotationRepository = new AnnotationRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  return new CreateAnnotationUseCase(notificationRepository2, notificationService2, annotationRepository, userRepository2);
}

// src/http/controller/annotation/create.ts
var import_zod12 = require("zod");
function createAnnotation(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod12.z.object({
        information: import_zod12.z.string(),
        title: import_zod12.z.string(),
        color: import_zod12.z.string(),
        userId: import_zod12.z.string()
      });
      const data = bodySchema.parse(req.body);
      const annotationUseCase = makeCreateAnnotation();
      const annotation = yield annotationUseCase.execute(data);
      res.status(200).send(annotation);
    } catch (error) {
      next();
    }
  });
}

// src/use-cases/cases/annotation/delete.ts
var DeleteAnnotationUseCase = class {
  constructor(notificationRepository2, notificationService2, annotationRepository, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.annotationRepository = annotationRepository;
    this.userRepository = userRepository2;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      userId,
      annotationId
    }) {
      const user = yield this.userRepository.getUserById(userId);
      if (!user) {
        throw new ErrorHandler(400, "User not found, try again");
      }
      const annotation = yield this.annotationRepository.getById(annotationId);
      if (!annotation) {
        throw new ErrorHandler(400, "Annotation not found, try again");
      }
      if (annotation.userId !== user.id) {
        throw new ErrorHandler(
          400,
          "Unauthorized, Only owner can delete the Annotation"
        );
      }
      const deletedAnnotation = yield this.annotationRepository.delete(annotationId);
      const notificationParams = {
        userId,
        senderId: userId,
        message: `Voc\xEA acabou de deletar sua anota\xE7\xE3o`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      return deletedAnnotation;
    });
  }
};

// src/use-cases/factories/annotation/delete.ts
var import_client19 = require("@prisma/client");
function makeDeleteAnnotation() {
  const prisma3 = new import_client19.PrismaClient();
  const notificationRepository2 = new NotificationRepository(prisma3);
  const notificationService2 = new SendNotification();
  const annotationRepository = new AnnotationRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  return new DeleteAnnotationUseCase(notificationRepository2, notificationService2, annotationRepository, userRepository2);
}

// src/http/controller/annotation/delete.ts
var import_zod13 = require("zod");
function deleteAnnotation(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod13.z.object({
        userId: import_zod13.z.string(),
        annotationId: import_zod13.z.string()
      });
      const data = bodySchema.parse(req.body);
      const annotationUseCase = makeDeleteAnnotation();
      yield annotationUseCase.execute(data);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/cases/annotation/get-by-id.ts
var GetByIdUseCase = class {
  constructor(annotationRepository) {
    this.annotationRepository = annotationRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({ annotationId }) {
      const annotation = yield this.annotationRepository.getById(annotationId);
      if (!annotation) {
        throw new ErrorHandler(400, "Annotation not found, try again");
      }
      return annotation;
    });
  }
};

// src/use-cases/factories/annotation/get-by-id.ts
var import_client20 = require("@prisma/client");
function makeGetByIdAnnotation() {
  const prisma3 = new import_client20.PrismaClient();
  const annotationRepository = new AnnotationRepository(prisma3);
  return new GetByIdUseCase(annotationRepository);
}

// src/http/controller/annotation/get-by-id.ts
var import_zod14 = require("zod");
function getByIdAnnotation(req, res, next) {
  return __async(this, null, function* () {
    try {
      const reqParser = import_zod14.z.object({
        annotationId: import_zod14.z.string()
      });
      const data = reqParser.parse(req.params);
      const annotationUseCase = makeGetByIdAnnotation();
      const annotation = yield annotationUseCase.execute(data);
      res.sendStatus(200).send(annotation);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/cases/annotation/get-by-user-id.ts
var GetByUserIdUseCase = class {
  constructor(annotationRepository, userRepository2) {
    this.annotationRepository = annotationRepository;
    this.userRepository = userRepository2;
  }
  execute(_0) {
    return __async(this, arguments, function* ({ userId }) {
      const user = yield this.userRepository.getUserById(userId);
      if (!user) {
        throw new ErrorHandler(400, "User not found, try again");
      }
      const annotations = yield this.annotationRepository.getByUserId(userId);
      return annotations;
    });
  }
};

// src/use-cases/factories/annotation/get-by-user-id.ts
var import_client21 = require("@prisma/client");
function makeGetByUserIdAnnotation() {
  const prisma3 = new import_client21.PrismaClient();
  const annotationRepository = new AnnotationRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  return new GetByUserIdUseCase(annotationRepository, userRepository2);
}

// src/http/controller/annotation/get-by-user-id.ts
var import_zod15 = require("zod");
function getByUserId(req, res, next) {
  return __async(this, null, function* () {
    try {
      const reqParse = import_zod15.z.object({
        userId: import_zod15.z.string()
      });
      const data = reqParse.parse(req.params);
      const annotationUseCase = makeGetByUserIdAnnotation();
      const annotation = yield annotationUseCase.execute(data);
      res.status(200).send(annotation);
    } catch (error) {
      next(error);
    }
  });
}

// src/repository/prisma/prisma-project-repository.ts
var ProjectRepository = class {
  constructor(prisma3) {
    this.prisma = prisma3;
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

// src/use-cases/cases/project/add-user-in-project.ts
var AddUserInProjectUseCase = class {
  constructor(notificationRepository2, notificationService2, projectRepository2, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.projectRepository = projectRepository2;
    this.userRepository = userRepository2;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      ownerId,
      projectId,
      userId
    }) {
      const owner = yield this.userRepository.getUserById(ownerId);
      if (!owner) {
        throw new ErrorHandler(400, "Owner not found, try again");
      }
      const user = yield this.userRepository.getUserById(userId);
      if (!user) {
        throw new ErrorHandler(400, "Add User not found, try again");
      }
      const project = yield this.projectRepository.findProjectById(projectId);
      if (!project) {
        throw new ErrorHandler(400, "Project not found, try again");
      }
      const userInProject = yield this.projectRepository.isUserInProject(
        projectId,
        userId
      );
      if (userInProject) {
        return { message: "User is already in the project" };
      }
      yield this.projectRepository.addUserInProject(projectId, userId);
      const notificationParams = {
        userId,
        senderId: ownerId,
        message: `Voc\xEA foi convidado para o projeto ${project.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      return { message: "User added successfully" };
    });
  }
};

// src/use-cases/factories/project/add-user-in-project.ts
var import_client22 = require("@prisma/client");
function makeAddUserInProjectUseCase() {
  const prisma3 = new import_client22.PrismaClient();
  const notificationRepository2 = new NotificationRepository(prisma3);
  const notificationService2 = new SendNotification();
  const projectRepository2 = new ProjectRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  const addUserInProjectUseCase = new AddUserInProjectUseCase(
    notificationRepository2,
    notificationService2,
    projectRepository2,
    userRepository2
  );
  return addUserInProjectUseCase;
}

// src/http/controller/project/add-user-in-project.ts
var import_zod16 = require("zod");
function addUserInProject(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod16.z.object({
        ownerId: import_zod16.z.string(),
        projectId: import_zod16.z.string(),
        userId: import_zod16.z.string()
      });
      const data = bodySchema.parse(req.body);
      const addUserInProjectUseCase = makeAddUserInProjectUseCase();
      const result = yield addUserInProjectUseCase.execute(data);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  });
}

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

// src/use-cases/factories/project/create.ts
var import_client23 = require("@prisma/client");
function makeCreateProject() {
  const prisma3 = new import_client23.PrismaClient();
  const notificationRepository2 = new NotificationRepository(prisma3);
  const notificationService2 = new SendNotification();
  const projectRepository2 = new ProjectRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  const createProject2 = new CreateProjectUseCase(
    notificationRepository2,
    notificationService2,
    projectRepository2,
    userRepository2
  );
  return createProject2;
}

// src/http/controller/project/create.ts
var import_client24 = require("@prisma/client");
var import_zod17 = require("zod");
function createProject(req, res, next) {
  return __async(this, null, function* () {
    try {
      const privacySchema = import_zod17.z.enum([import_client24.Privacy.Private, import_client24.Privacy.Public]);
      const bodySchema = import_zod17.z.object({
        name: import_zod17.z.string(),
        color: import_zod17.z.string(),
        ownerId: import_zod17.z.string(),
        privacy: privacySchema,
        usersIds: import_zod17.z.array(import_zod17.z.string())
      });
      const data = bodySchema.parse(req.body);
      const createProjectUserCase = makeCreateProject();
      const result = yield createProjectUserCase.execute(data);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/cases/project/delete.ts
var DeleteProjectUseCase = class {
  constructor(notificationRepository2, notificationService2, projectRepository2, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.projectRepository = projectRepository2;
    this.userRepository = userRepository2;
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
var import_client25 = require("@prisma/client");
function makeDeleteProject() {
  const prisma3 = new import_client25.PrismaClient();
  const notificationRepository2 = new NotificationRepository(prisma3);
  const notificationService2 = new SendNotification();
  const projectRepository2 = new ProjectRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  const deleteProject2 = new DeleteProjectUseCase(
    notificationRepository2,
    notificationService2,
    projectRepository2,
    userRepository2
  );
  return deleteProject2;
}

// src/http/controller/project/delete.ts
var import_zod18 = require("zod");
function deleteProject(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod18.z.object({
        projectId: import_zod18.z.string(),
        ownerId: import_zod18.z.string()
      });
      const { projectId, ownerId } = bodySchema.parse(req.body);
      const deleteProjectUseCase = makeDeleteProject();
      yield deleteProjectUseCase.execute(projectId, ownerId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/cases/project/get-projects-by-user-id.ts
var GetProjectsByUserIdUseCase = class {
  constructor(projectRepository2, userRepository2) {
    this.projectRepository = projectRepository2;
    this.userRepository = userRepository2;
  }
  execute(userId) {
    return __async(this, null, function* () {
      const user = yield this.userRepository.getUserById(userId);
      if (!user) {
        throw new ErrorHandler(400, "User not found, try again");
      }
      const projects = yield this.projectRepository.findByUserId(userId);
      return projects;
    });
  }
};

// src/use-cases/factories/project/get-projects-by-user-id.ts
var import_client26 = require("@prisma/client");
function makeGetProjectsByUserIdUseCase() {
  const prisma3 = new import_client26.PrismaClient();
  const projectRepository2 = new ProjectRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  const getProjectsByUserIdUseCase = new GetProjectsByUserIdUseCase(
    projectRepository2,
    userRepository2
  );
  return getProjectsByUserIdUseCase;
}

// src/http/controller/project/get-projects-by-user-id.ts
var import_zod19 = require("zod");
function getProjectsByUserId(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod19.z.object({
        userId: import_zod19.z.string()
      });
      const { userId } = bodySchema.parse(req.body);
      const getProjectsByUserIdUseCase = makeGetProjectsByUserIdUseCase();
      const projects = yield getProjectsByUserIdUseCase.execute(userId);
      res.status(200).send(projects);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/cases/project/remove-user-in-project.ts
var RemoveUserInProjectUseCase = class {
  constructor(notificationRepository2, notificationService2, projectRepository2, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.projectRepository = projectRepository2;
    this.userRepository = userRepository2;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      ownerId,
      projectId,
      userId
    }) {
      const owner = yield this.userRepository.getUserById(ownerId);
      if (!owner) {
        throw new ErrorHandler(400, "Owner not found, try again");
      }
      const user = yield this.userRepository.getUserById(userId);
      if (!user) {
        throw new ErrorHandler(400, "Add User not found, try again");
      }
      const project = yield this.projectRepository.findProjectById(projectId);
      if (!project) {
        throw new ErrorHandler(400, "Project not found, try again");
      }
      const userInProject = yield this.projectRepository.isUserInProject(
        projectId,
        userId
      );
      if (!userInProject) {
        return { message: "Not User is already in the project" };
      }
      yield this.projectRepository.removeUserInProject(projectId, userId);
      const notificationParams = {
        userId,
        senderId: ownerId,
        message: `Voc\xEA foi removido do projeto ${project.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      return { message: "User removed successfully" };
    });
  }
};

// src/use-cases/factories/project/remove-user-in-project.ts
var import_client27 = require("@prisma/client");
function makeRemoveUserInProjectUseCase() {
  const prisma3 = new import_client27.PrismaClient();
  const notificationRepository2 = new NotificationRepository(prisma3);
  const notificationService2 = new SendNotification();
  const projectRepository2 = new ProjectRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  const removeUserInProjectUseCase = new RemoveUserInProjectUseCase(
    notificationRepository2,
    notificationService2,
    projectRepository2,
    userRepository2
  );
  return removeUserInProjectUseCase;
}

// src/http/controller/project/remove-user-in-project.ts
var import_zod20 = require("zod");
function removeUserInProject(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod20.z.object({
        ownerId: import_zod20.z.string(),
        projectId: import_zod20.z.string(),
        userId: import_zod20.z.string()
      });
      const data = bodySchema.parse(req.body);
      const removeUserInProjectUseCase = makeRemoveUserInProjectUseCase();
      const projects = yield removeUserInProjectUseCase.execute(data);
      res.status(200).send(projects);
    } catch (error) {
      next(error);
    }
  });
}

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

// src/use-cases/factories/project/update-status-privacy.ts
var import_client28 = require("@prisma/client");
function makeUpdateStatusPrivacyProjectUseCase() {
  const prisma3 = new import_client28.PrismaClient();
  const projectRepository2 = new ProjectRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  const updateStatusPrivacyProjectUseCase = new UpdateStatusPrivacyProjectUseCase(projectRepository2, userRepository2);
  return updateStatusPrivacyProjectUseCase;
}

// src/http/controller/project/update-status-privacy.ts
var import_client29 = require("@prisma/client");
var import_zod21 = require("zod");
function updateStatusPrivacy(req, res, next) {
  return __async(this, null, function* () {
    try {
      const privacySchema = import_zod21.z.enum([import_client29.Privacy.Private, import_client29.Privacy.Public]);
      const bodySchema = import_zod21.z.object({
        projectId: import_zod21.z.string(),
        ownerId: import_zod21.z.string(),
        statusPrivacy: privacySchema
      });
      const { projectId, ownerId, statusPrivacy } = bodySchema.parse(req.body);
      const updateStatusPrivacyProjectUseCase = makeUpdateStatusPrivacyProjectUseCase();
      const updateProject = yield updateStatusPrivacyProjectUseCase.execute(
        projectId,
        ownerId,
        statusPrivacy
      );
      res.status(200).send(updateProject);
    } catch (error) {
      next(error);
    }
  });
}

// src/repository/prisma/prisma-task-repository.ts
var import_client30 = require("@prisma/client");
var prisma2 = new import_client30.PrismaClient();
var TaskRepository = class {
  delete(taskId) {
    return __async(this, null, function* () {
      yield prisma2.task.delete({
        where: { id: taskId }
      });
    });
  }
  create(data) {
    return __async(this, null, function* () {
      return yield prisma2.task.create({
        data
      });
    });
  }
  updateStatus(taskId, status) {
    return __async(this, null, function* () {
      return yield prisma2.task.update({
        where: { id: taskId },
        data: { status }
      });
    });
  }
  findById(taskId) {
    return __async(this, null, function* () {
      const task = yield prisma2.task.findUnique({
        where: { id: taskId }
      });
      if (!task) return null;
      return task;
    });
  }
};

// src/use-cases/factories/task/create.ts
var import_client31 = require("@prisma/client");
function makeCreateTask() {
  const prisma3 = new import_client31.PrismaClient();
  const notificationRepository2 = new NotificationRepository(prisma3);
  const notificationService2 = new SendNotification();
  const taskRepository2 = new TaskRepository();
  const projectRepository2 = new ProjectRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  const createTask2 = new CreateTaskUseCase(
    notificationRepository2,
    notificationService2,
    taskRepository2,
    projectRepository2,
    userRepository2
  );
  return createTask2;
}

// src/http/controller/task/create.ts
var import_client32 = require("@prisma/client");
var import_zod22 = require("zod");
function createTask(req, res, next) {
  return __async(this, null, function* () {
    try {
      const StatusSchema = import_zod22.z.enum([
        import_client32.Status.Analysis,
        import_client32.Status.Completed,
        import_client32.Status.Development,
        import_client32.Status.Testing,
        import_client32.Status.To_Do
      ]);
      const bodySchema = import_zod22.z.object({
        title: import_zod22.z.string(),
        information: import_zod22.z.string(),
        files: import_zod22.z.string(),
        status: StatusSchema,
        projectId: import_zod22.z.string(),
        responsibleId: import_zod22.z.string()
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

// src/use-cases/factories/task/delete.ts
var import_client33 = require("@prisma/client");
function makeDeleteTask() {
  const prisma3 = new import_client33.PrismaClient();
  const taskRepository2 = new TaskRepository();
  const userRepository2 = new UserRepository(prisma3);
  const deleteTask2 = new DeleteTaskUseCase(taskRepository2, userRepository2);
  return deleteTask2;
}

// src/http/controller/task/delete.ts
var import_zod23 = require("zod");
function deleteTask(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod23.z.object({
        taskId: import_zod23.z.string(),
        userId: import_zod23.z.string()
      });
      const { taskId, userId } = bodySchema.parse(req.body);
      const taskUseCase = makeDeleteTask();
      const task = yield taskUseCase.execute(taskId, userId);
      return res.status(200).send(task);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/cases/task/update-status.ts
var UpdateTaskStatusUseCase = class {
  constructor(taskRepository2, userRepository2) {
    this.taskRepository = taskRepository2;
    this.userRepository = userRepository2;
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
var import_client34 = require("@prisma/client");
function makeUpdateTaskStatus() {
  const prisma3 = new import_client34.PrismaClient();
  const taskRepository2 = new TaskRepository();
  const userRepository2 = new UserRepository(prisma3);
  const createTask2 = new UpdateTaskStatusUseCase(
    taskRepository2,
    userRepository2
  );
  return createTask2;
}

// src/http/controller/task/update-status.ts
var import_client35 = require("@prisma/client");
var import_zod24 = require("zod");
function updateTaskStatus(req, res, next) {
  return __async(this, null, function* () {
    try {
      const StatusSchema = import_zod24.z.enum([
        import_client35.Status.Analysis,
        import_client35.Status.Completed,
        import_client35.Status.Development,
        import_client35.Status.Testing,
        import_client35.Status.To_Do
      ]);
      const bodySchema = import_zod24.z.object({
        taskId: import_zod24.z.string(),
        status: StatusSchema,
        userId: import_zod24.z.string()
      });
      const { taskId, status, userId } = bodySchema.parse(req.body);
      const taskUseCase = makeUpdateTaskStatus();
      const task = yield taskUseCase.execute(taskId, status, userId);
      return res.status(200).send(task);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/cases/email/valid-email-token.ts
var import_moment = __toESM(require("moment"));
var ValidEmailToken = class {
  constructor(emailTokenRepository, userRepository2) {
    this.emailTokenRepository = emailTokenRepository;
    this.userRepository = userRepository2;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email, token } = data;
      const emailAlreadyExists = yield this.userRepository.getUser({ email });
      if (!emailAlreadyExists) {
        throw new ErrorHandler(400, "Email not exists, try again");
      }
      const validEmailToken = yield this.emailTokenRepository.checkEmailToken(email);
      if (!validEmailToken) {
        throw new ErrorHandler(400, "Token not exists, try again");
      }
      const tokenDateFormat = (0, import_moment.default)(validEmailToken.createdAt);
      const currentTime = (0, import_moment.default)().utc();
      const hoursDiff = Math.abs(currentTime.diff(tokenDateFormat, "hours"));
      if (hoursDiff >= 24) {
        yield this.emailTokenRepository.deleteEmailToken(email);
        throw new ErrorHandler(400, "Token has expired, create again");
      }
      if (validEmailToken.attempts === 3) {
        yield this.emailTokenRepository.deleteEmailToken(email);
        throw new ErrorHandler(
          400,
          "Number of attempts exceeded, please create a new token"
        );
      }
      const compareToken = token === validEmailToken.token;
      if (!compareToken) {
        yield this.emailTokenRepository.updateAttemptsEmailToken({
          email,
          attempts: validEmailToken.attempts + 1
        });
        throw new ErrorHandler(400, "The Token sent is invalid, try again");
      }
      yield this.emailTokenRepository.updateEmailToken({
        email,
        validated: true
      });
    });
  }
};

// src/use-cases/factories/email/valid-email-token.ts
var import_client36 = require("@prisma/client");
function makeValidEmailToken() {
  const prisma3 = new import_client36.PrismaClient();
  const userRepository2 = new UserRepository(prisma3);
  const emailTokenRepository = new EmailTokenRepository(prisma3);
  return new ValidEmailToken(emailTokenRepository, userRepository2);
}

// src/http/controller/email/valid-email-token.ts
var import_zod25 = require("zod");
function ValidEmailToken2(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod25.z.object({
        email: import_zod25.z.string().email(),
        token: import_zod25.z.string().max(5)
      });
      const data = bodySchema.parse(req.body);
      const emailUseCase = makeValidEmailToken();
      yield emailUseCase.execute(data);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/cases/email/send-email-token.ts
var import_chance5 = __toESM(require("chance"));
var chance5 = new import_chance5.default();
var SendEmailTokenUseCase = class {
  constructor(userRepository2, sendEmailTokeService, emailTokenRepository) {
    this.userRepository = userRepository2;
    this.sendEmailTokeService = sendEmailTokeService;
    this.emailTokenRepository = emailTokenRepository;
  }
  execute(email) {
    return __async(this, null, function* () {
      const userAlreadyExists = yield this.userRepository.getUser({ email });
      if (!userAlreadyExists) {
        throw new ErrorHandler(400, "User not exists, try again");
      }
      const validEmailToken = yield this.emailTokenRepository.checkEmailToken(email);
      if (validEmailToken) {
        yield this.emailTokenRepository.deleteEmailToken(email);
      }
      const token = chance5.string({ numeric: true, length: 5 });
      yield this.sendEmailTokeService.send(email, token);
      const saveEmailToken = {
        email,
        token,
        validated: false,
        attempts: 0
      };
      yield this.emailTokenRepository.create(saveEmailToken);
    });
  }
};

// src/use-cases/factories/email/send-email-token.ts
var import_client37 = require("@prisma/client");
function makeSendEmailToken() {
  const prisma3 = new import_client37.PrismaClient();
  const emailTokenRepository = new EmailTokenRepository(prisma3);
  const userRepository2 = new UserRepository(prisma3);
  const sendEmail = new SendEmailToken();
  return new SendEmailTokenUseCase(
    userRepository2,
    sendEmail,
    emailTokenRepository
  );
}

// src/http/controller/email/send-email-token.ts
var import_zod26 = require("zod");
function SendEmailToken2(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod26.z.object({
        email: import_zod26.z.string().email()
      });
      const { email } = bodySchema.parse(req.body);
      const emailUseCase = makeSendEmailToken();
      yield emailUseCase.execute(email);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
}

// src/use-cases/cases/password/change-password.ts
var import_bcryptjs4 = __toESM(require("bcryptjs"));
var ChangePassword = class {
  constructor(userRepository2, emailTokenRepository) {
    this.userRepository = userRepository2;
    this.emailTokenRepository = emailTokenRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email, password, confirmPassword } = data;
      const emailAlreadyExists = yield this.userRepository.getUser({ email });
      if (!emailAlreadyExists) {
        throw new ErrorHandler(400, "Email not exists, try again");
      }
      const validEmailToken = yield this.emailTokenRepository.checkEmailToken(email);
      if (!validEmailToken) {
        throw new ErrorHandler(400, "Token not exists, try again");
      }
      if (validEmailToken.validated !== true) {
        throw new ErrorHandler(
          400,
          "The Token has not yet been validated, please try again"
        );
      }
      const comparePassword = password === confirmPassword;
      if (!comparePassword) {
        throw new ErrorHandler(400, "Password is not equal");
      }
      yield this.userRepository.changePassword({
        email,
        password: yield import_bcryptjs4.default.hash(password, 8)
      });
      yield this.emailTokenRepository.deleteEmailToken(email);
    });
  }
};

// src/use-cases/factories/password/change-password.ts
var import_client38 = require("@prisma/client");
function makeChangePassword() {
  const prisma3 = new import_client38.PrismaClient();
  const userRepository2 = new UserRepository(prisma3);
  const emailTokenRepository = new EmailTokenRepository(prisma3);
  return new ChangePassword(userRepository2, emailTokenRepository);
}

// src/http/controller/password/change-password.ts
var import_zod27 = require("zod");
function ChangePassword2(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod27.z.object({
        email: import_zod27.z.string().email(),
        password: import_zod27.z.string(),
        confirmPassword: import_zod27.z.string()
      });
      const data = bodySchema.parse(req.body);
      const changePasswordUseCase = makeChangePassword();
      yield changePasswordUseCase.execute(data);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
}

// src/routes/route.ts
var router = (0, import_express.Router)();
router.post("/createUser", createUser);
router.post("/loginUser", loginUser);
router.patch("/editUser", authenticateUser, editUser);
router.delete("/deleteUser", authenticateUser, deleteUser);
router.get("/users", authenticateUser, getUsers);
router.post("/validEmail", ValidEmailToken2);
router.post("/sendEmailToken", SendEmailToken2);
router.patch("/changePassword", ChangePassword2);
router.post("/sendMessage", authenticateUser, sendMessage);
router.get("/allMessages", authenticateUser, getAllMessages);
router.get("/messagesByChatId/:chatId", authenticateUser, getMessagesByChatId);
router.get("/messagesByUserId/:userId", authenticateUser, getMessagesByUserId);
router.post("/createTask", authenticateUser, createTask);
router.delete("/deleteTask", authenticateUser, deleteTask);
router.patch("/updateTaskStatus", authenticateUser, updateTaskStatus);
router.patch("/addUserProject", authenticateUser, addUserInProject);
router.post("/createProject", authenticateUser, createProject);
router.delete("/deleteProject", authenticateUser, deleteProject);
router.get("/projectsByUserId", authenticateUser, getProjectsByUserId);
router.delete("/removeUserInProject", authenticateUser, removeUserInProject);
router.patch("/updateStatusPrivacy", authenticateUser, updateStatusPrivacy);
router.post("/addUserToRoom", authenticateUser, addUserToRoomController);
router.post("/addVideoRoom", authenticateUser, addVideoRoom);
router.post("/createRoom", authenticateUser, createRoomController);
router.delete("/deleteRoom/:roomId", authenticateUser, deleteRoomController);
router.get("/getRoomById/:roomId", authenticateUser, getRoomByIdController);
router.delete("/deleteUserToRoom", authenticateUser, removeUserToRoomController);
router.patch("/updateRoom", authenticateUser, updateRoomController);
router.post("/createAnnotation", authenticateUser, createAnnotation);
router.delete("/deleteAnnotation", authenticateUser, deleteAnnotation);
router.get(
  "/getAnnotationById/:annotationId",
  authenticateUser,
  getByIdAnnotation
);
router.get("/getAnnotationByUserId/:userId", authenticateUser, getByUserId);

// src/index.ts
var import_socket = require("socket.io");

// src/websocket/chatSocket.ts
function chatSocket(io2) {
  io2.on("connection", (socket) => {
    socket.on("disconnect", () => {
    });
  });
}

// src/index.ts
var import_express2 = __toESM(require("express"));
var app = (0, import_express2.default)();
app.use((0, import_cors.default)());
var port = 3003;
var httpServer = (0, import_http.createServer)(app);
var io = new import_socket.Server(httpServer);
chatSocket(io);
var start = () => __async(void 0, null, function* () {
  app.use(import_express2.default.json());
  app.use(router);
  app.use(
    (err, req, res, next) => {
      handleError(err, req, res, next);
    }
  );
  app.use(import_express2.default.urlencoded({ extended: true }));
  app.set("trust proxy", true);
  app.disable("etag");
  import_axios.default.interceptors.request.use((request) => {
    request.maxContentLength = Infinity;
    request.maxBodyLength = Infinity;
    return request;
  });
  try {
    httpServer.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(`Error occurred: ${error.message}`);
  }
});
start();

// src/service/sendNotification.ts
var SendNotification = class {
  send(data) {
    return __async(this, null, function* () {
      io.emit("notification", data);
    });
  }
};

// src/use-cases/cases/task/create.spec.ts
var sut;
var taskRepository;
var userRepository;
var taskData;
var projectRepository;
var notificationRepository;
var notificationService;
(0, import_vitest.describe)("Create Task Use Case", () => {
  const setupTaskData = () => __async(exports, null, function* () {
    const { user, project } = yield createMockUserAndProject(
      userRepository,
      projectRepository
    );
    taskData = {
      title: chance.sentence({ words: 3 }),
      information: chance.paragraph(),
      status: "To_Do",
      projectId: project.id,
      responsibleId: user.id,
      files: chance.url()
    };
  });
  (0, import_vitest.beforeEach)(() => __async(exports, null, function* () {
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
    yield setupTaskData();
  }));
  (0, import_vitest.it)("should be able to create a task", () => __async(exports, null, function* () {
    const task = yield sut.execute(taskData);
    (0, import_vitest.expect)(task).toHaveProperty("id");
    (0, import_vitest.expect)(task.title).toBe(taskData.title);
  }));
  (0, import_vitest.it)("should not be able to create a task if project does not exist", () => __async(exports, null, function* () {
    const invalidTaskData = __spreadProps(__spreadValues({}, taskData), {
      projectId: "nonexistent-project-id"
    });
    yield (0, import_vitest.expect)(sut.execute(invalidTaskData)).rejects.toBeInstanceOf(
      ErrorHandler
    );
  }));
  (0, import_vitest.it)("should not be able to create a task if responsible user does not exist", () => __async(exports, null, function* () {
    const invalidTaskData = __spreadProps(__spreadValues({}, taskData), {
      responsibleId: "nonexistent-user-id"
    });
    yield (0, import_vitest.expect)(sut.execute(invalidTaskData)).rejects.toBeInstanceOf(
      ErrorHandler
    );
  }));
  (0, import_vitest.it)("should not be able to create a task if responsible user is not in the project", () => __async(exports, null, function* () {
    const anotherUser = yield createMockUser(userRepository);
    const invalidTaskData = __spreadProps(__spreadValues({}, taskData), { responsibleId: anotherUser.id });
    yield (0, import_vitest.expect)(sut.execute(invalidTaskData)).rejects.toBeInstanceOf(
      ErrorHandler
    );
  }));
});
