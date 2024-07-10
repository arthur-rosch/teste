"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
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

// src/repository/in-memory/index.ts
var in_memory_exports = {};
__export(in_memory_exports, {
  InMemoryAnnotationRepository: () => InMemoryAnnotationRepository,
  InMemoryEmailTokenRepository: () => InMemoryEmailTokenRepository,
  InMemoryFinancialRepository: () => InMemoryFinancialRepository,
  InMemoryNotificationRepository: () => InMemoryNotificationRepository,
  InMemoryProjectRepository: () => InMemoryProjectRepository,
  InMemoryRoomRepository: () => InMemoryRoomRepository,
  InMemoryTaskRepository: () => InMemoryTaskRepository,
  InMemoryUserRepository: () => InMemoryUserRepository
});
module.exports = __toCommonJS(in_memory_exports);

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

// src/repository/in-memory/in-memory-annotation-repository.ts
var InMemoryAnnotationRepository = class {
  constructor() {
    this.annotations = [];
  }
  delete(annotationId) {
    return __async(this, null, function* () {
      const annotationIndex = this.annotations.findIndex(
        (annotation) => annotation.id === annotationId
      );
      const [deletedAnnotation] = this.annotations.splice(annotationIndex, 1);
      return deletedAnnotation;
    });
  }
  getByUserId(userId) {
    return __async(this, null, function* () {
      return this.annotations.filter((annotation) => annotation.userId === userId);
    });
  }
  getById(annotationId) {
    return __async(this, null, function* () {
      return this.annotations.find((annotation) => annotation.id === annotationId) || null;
    });
  }
  create(data) {
    return __async(this, null, function* () {
      const annotation = __spreadValues({
        id: (this.annotations.length + 1).toString()
      }, data);
      this.annotations.push(annotation);
      return annotation;
    });
  }
};

// src/repository/in-memory/in-memory-room-repository.ts
var InMemoryRoomRepository = class {
  constructor() {
    this.rooms = {};
    this.usersInRooms = {};
    this.videoRooms = [];
  }
  create(data) {
    return __async(this, null, function* () {
      var _a, _b;
      const id = (Math.random() * 1e4).toFixed(0);
      const createdAt = /* @__PURE__ */ new Date();
      const updatedAt = createdAt;
      const room = __spreadProps(__spreadValues({}, data), {
        id,
        createdAt,
        updatedAt,
        ownerId: ((_b = (_a = data.owner) == null ? void 0 : _a.connect) == null ? void 0 : _b.id) || ""
      });
      this.rooms[id] = room;
      this.usersInRooms[id] = /* @__PURE__ */ new Set();
      return room;
    });
  }
  getById(roomId) {
    return __async(this, null, function* () {
      return this.rooms[roomId] || null;
    });
  }
  update(name, roomId) {
    return __async(this, null, function* () {
      if (this.rooms[roomId]) {
        this.rooms[roomId].name = name;
      }
    });
  }
  delete(roomId) {
    return __async(this, null, function* () {
      delete this.rooms[roomId];
      delete this.usersInRooms[roomId];
    });
  }
  addUserToChat(roomId, userId) {
    return __async(this, null, function* () {
      if (this.usersInRooms[roomId]) {
        this.usersInRooms[roomId].add(userId);
      }
    });
  }
  removeUserFromChat(roomId, userId) {
    return __async(this, null, function* () {
      if (this.usersInRooms[roomId]) {
        this.usersInRooms[roomId].delete(userId);
      }
    });
  }
  createVideoRoom(ownerId, roomId, roomLink) {
    return __async(this, null, function* () {
      const newVideoRoom = {
        id: (Math.random() * 1e4).toFixed(0),
        ownerId,
        roomId,
        roomLink
      };
      this.videoRooms.push(newVideoRoom);
      return newVideoRoom;
    });
  }
};

// src/repository/in-memory/in-memory-emailToken-repository.ts
var InMemoryEmailTokenRepository = class {
  constructor() {
    this.tokens = [];
  }
  create(data) {
    return __async(this, null, function* () {
      this.tokens.push(data);
    });
  }
  checkEmailToken(email) {
    return __async(this, null, function* () {
      const token = this.tokens.find((token2) => token2.email === email);
      return token || null;
    });
  }
  deleteEmailToken(email) {
    return __async(this, null, function* () {
      this.tokens = this.tokens.filter((token) => token.email !== email);
    });
  }
  updateAttemptsEmailToken(data) {
    return __async(this, null, function* () {
      const tokenIndex = this.tokens.findIndex(
        (token) => token.email === data.email
      );
      if (tokenIndex !== -1) {
        this.tokens[tokenIndex].attempts = data.attempts || 0;
      }
    });
  }
  updateEmailToken(data) {
    return __async(this, null, function* () {
      const tokenIndex = this.tokens.findIndex(
        (token) => token.email === data.email
      );
      if (tokenIndex !== -1) {
        this.tokens[tokenIndex].validated = data.validated || false;
      }
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

// src/repository/in-memory/in-memory-financial-repository.ts
var InMemoryFinancialRepository = class {
  constructor() {
    this.financialRegistrations = [];
    this.clients = [];
    this.expenses = [];
    this.receivables = [];
    this.extraExpenses = [];
  }
  createFinancial(userId) {
    return __async(this, null, function* () {
      const financialRegistration = {
        id: Math.random().toString(),
        userId
      };
      this.financialRegistrations.push(financialRegistration);
      return financialRegistration;
    });
  }
  getFinancial(userId) {
    return __async(this, null, function* () {
      return this.financialRegistrations.find((fr) => fr.userId === userId) || null;
    });
  }
  createClient(params) {
    return __async(this, null, function* () {
      this.clients.push(params);
      return params;
    });
  }
  getClientById(id) {
    return __async(this, null, function* () {
      return this.clients.find((client) => client.id === id) || null;
    });
  }
  editClient(clientId, data) {
    return __async(this, null, function* () {
      const index = this.clients.findIndex((client) => client.id === clientId);
      if (index === -1) {
        throw new Error("Client not found");
      }
      this.clients[index] = __spreadValues(__spreadValues({}, this.clients[index]), data);
      return this.clients[index];
    });
  }
  deleteClient(clientId) {
    return __async(this, null, function* () {
      const index = this.clients.findIndex((client) => client.id === clientId);
      if (index === -1) {
        throw new Error("Client not found");
      }
      const [deletedClient] = this.clients.splice(index, 1);
      return deletedClient;
    });
  }
  getAllClientByFinancialId(id) {
    return __async(this, null, function* () {
      return this.clients.filter(
        (client) => client.financialRegistrationId === id
      );
    });
  }
  createExpenses(params) {
    return __async(this, null, function* () {
      this.expenses.push(params);
      return params;
    });
  }
  editExpense(expenseId, data) {
    return __async(this, null, function* () {
      const index = this.expenses.findIndex((expense) => expense.id === expenseId);
      this.expenses[index] = __spreadValues(__spreadValues({}, this.expenses[index]), data);
      return this.expenses[index];
    });
  }
  getExpenseById(id) {
    return __async(this, null, function* () {
      return this.expenses.find((expense) => expense.id === id) || null;
    });
  }
  deleteExpense(expenseId) {
    return __async(this, null, function* () {
      const index = this.expenses.findIndex((expense) => expense.id === expenseId);
      if (index === -1) {
        throw new Error("Expense not found");
      }
      const [deletedExpense] = this.expenses.splice(index, 1);
      return deletedExpense;
    });
  }
  getAllExpenseByFinancialId(id) {
    return __async(this, null, function* () {
      return this.expenses.filter(
        (expense) => expense.financialRegistrationId === id
      );
    });
  }
  createReceivable(params) {
    return __async(this, null, function* () {
      this.receivables.push(params);
      return params;
    });
  }
  editReceivable(receivableId, data) {
    return __async(this, null, function* () {
      const index = this.receivables.findIndex(
        (receivable) => receivable.id === receivableId
      );
      if (index === -1) {
        throw new Error("Receivable not found");
      }
      this.receivables[index] = __spreadValues(__spreadValues({}, this.receivables[index]), data);
      return this.receivables[index];
    });
  }
  getReceivableById(id) {
    return __async(this, null, function* () {
      return this.receivables.find((receivable) => receivable.id === id) || null;
    });
  }
  deleteReceivable(receivableId) {
    return __async(this, null, function* () {
      const index = this.receivables.findIndex(
        (receivable) => receivable.id === receivableId
      );
      if (index === -1) {
        throw new Error("Receivable not found");
      }
      const [deletedReceivable] = this.receivables.splice(index, 1);
      return deletedReceivable;
    });
  }
  getAllReceivableByFinancialId(id) {
    return __async(this, null, function* () {
      return this.receivables.filter(
        (receivable) => receivable.financialRegistrationId === id
      );
    });
  }
  createExtraExpense(params) {
    return __async(this, null, function* () {
      this.extraExpenses.push(params);
      return params;
    });
  }
  editExtraExpense(extraExpenseId, data) {
    return __async(this, null, function* () {
      const index = this.extraExpenses.findIndex(
        (extraExpense) => extraExpense.id === extraExpenseId
      );
      if (index === -1) {
        throw new Error("Extra Expense not found");
      }
      this.extraExpenses[index] = __spreadValues(__spreadValues({}, this.extraExpenses[index]), data);
      return this.extraExpenses[index];
    });
  }
  getExtraExpenseById(id) {
    return __async(this, null, function* () {
      return this.extraExpenses.find((extraExpense) => extraExpense.id === id) || null;
    });
  }
  deleteExtraExpense(extraExpenseId) {
    return __async(this, null, function* () {
      const index = this.extraExpenses.findIndex(
        (extraExpense) => extraExpense.id === extraExpenseId
      );
      if (index === -1) {
        throw new Error("Extra Expense not found");
      }
      const [deletedExtraExpense] = this.extraExpenses.splice(index, 1);
      return deletedExtraExpense;
    });
  }
  getAllExtraExpenseByFinancialId(id) {
    return __async(this, null, function* () {
      return this.extraExpenses.filter(
        (extraExpense) => extraExpense.financialRegistrationId === id
      );
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryAnnotationRepository,
  InMemoryEmailTokenRepository,
  InMemoryFinancialRepository,
  InMemoryNotificationRepository,
  InMemoryProjectRepository,
  InMemoryRoomRepository,
  InMemoryTaskRepository,
  InMemoryUserRepository
});
