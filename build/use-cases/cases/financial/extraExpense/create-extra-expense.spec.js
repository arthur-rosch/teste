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

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/financial/extraExpense/create-extra-expense.ts
var CreateUseCase = class {
  constructor(financialRepository2, userRepository2) {
    this.financialRepository = financialRepository2;
    this.userRepository = userRepository2;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      userId,
      amount,
      endDate,
      startDate,
      expenseType
    }) {
      const userAlreadyExist = yield this.userRepository.getUserById(userId);
      if (!userAlreadyExist) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      let financialExists = yield this.financialRepository.getFinancial(userId);
      if (!financialExists) {
        financialExists = yield this.financialRepository.createFinancial(userId);
      }
      const extraExpense = yield this.financialRepository.createExtraExpense({
        amount,
        endDate,
        startDate,
        expenseType,
        financialRegistrationId: financialExists.id
      });
      return extraExpense;
    });
  }
};

// src/use-cases/cases/financial/extraExpense/create-extra-expense.spec.ts
var import_vitest = require("vitest");

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
  getUser(user2) {
    return __async(this, null, function* () {
      return this.users.find((u) => u.email === user2.email) || null;
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
  deleteUser(user2) {
    return __async(this, null, function* () {
      this.users = this.users.filter((u) => u.email !== user2.email);
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

// src/lib/change.ts
var import_chance = __toESM(require("chance"));
var chance = new import_chance.default();

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/use-cases/cases/financial/extraExpense/create-extra-expense.spec.ts
var financialRepository;
var userRepository;
var sut;
(0, import_vitest.beforeEach)(() => {
  financialRepository = new InMemoryFinancialRepository();
  userRepository = new InMemoryUserRepository();
  sut = new CreateUseCase(financialRepository, userRepository);
});
var user = {
  id: chance.guid({ version: 4 }),
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  password: chance.name(),
  dateBirth: "22/08/2005"
};
var extraExpenseData = {
  id: "extra-expense-id-1",
  expenseType: "Business",
  amount: 500,
  startDate: /* @__PURE__ */ new Date("2023-01-01"),
  endDate: /* @__PURE__ */ new Date("2023-12-31"),
  financialRegistrationId: "financial-id-1"
};
(0, import_vitest.describe)("CreateUseCase", () => {
  (0, import_vitest.it)("should create an extra expense successfully", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    import_vitest.vi.spyOn(financialRepository, "getFinancial").mockResolvedValue({
      id: "financial-id-1",
      userId: user.id
    });
    import_vitest.vi.spyOn(financialRepository, "createExtraExpense").mockResolvedValue(
      extraExpenseData
    );
    const result = yield sut.execute({
      userId: user.id,
      amount: extraExpenseData.amount,
      startDate: extraExpenseData.startDate,
      endDate: extraExpenseData.endDate,
      expenseType: extraExpenseData.expenseType
    });
    (0, import_vitest.expect)(result).toEqual(extraExpenseData);
    (0, import_vitest.expect)(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    (0, import_vitest.expect)(financialRepository.getFinancial).toHaveBeenCalledWith(user.id);
    (0, import_vitest.expect)(financialRepository.createExtraExpense).toHaveBeenCalledWith({
      amount: extraExpenseData.amount,
      startDate: extraExpenseData.startDate,
      endDate: extraExpenseData.endDate,
      expenseType: extraExpenseData.expenseType,
      financialRegistrationId: "financial-id-1"
      // Adjust as per your test scenario
    });
  }));
  (0, import_vitest.it)("should throw an error if user is not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(null);
    yield (0, import_vitest.expect)(
      sut.execute({
        userId: user.id,
        amount: extraExpenseData.amount,
        startDate: extraExpenseData.startDate,
        endDate: extraExpenseData.endDate,
        expenseType: extraExpenseData.expenseType
      })
    ).rejects.toThrow(new ErrorHandler(400, "User Not Found, try again"));
  }));
  (0, import_vitest.it)("should create a financial registration if not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    import_vitest.vi.spyOn(financialRepository, "getFinancial").mockResolvedValue(null);
    import_vitest.vi.spyOn(financialRepository, "createFinancial").mockResolvedValue({
      id: "financial-id-1",
      userId: user.id
    });
    import_vitest.vi.spyOn(financialRepository, "createExtraExpense").mockResolvedValue(
      extraExpenseData
    );
    const result = yield sut.execute({
      userId: user.id,
      amount: extraExpenseData.amount,
      startDate: extraExpenseData.startDate,
      endDate: extraExpenseData.endDate,
      expenseType: extraExpenseData.expenseType
    });
    (0, import_vitest.expect)(result).toEqual(extraExpenseData);
    (0, import_vitest.expect)(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    (0, import_vitest.expect)(financialRepository.getFinancial).toHaveBeenCalledWith(user.id);
    (0, import_vitest.expect)(financialRepository.createFinancial).toHaveBeenCalledWith(user.id);
    (0, import_vitest.expect)(financialRepository.createExtraExpense).toHaveBeenCalledWith({
      amount: extraExpenseData.amount,
      startDate: extraExpenseData.startDate,
      endDate: extraExpenseData.endDate,
      expenseType: extraExpenseData.expenseType,
      financialRegistrationId: "financial-id-1"
      // Adjust as per your test scenario
    });
  }));
});
