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

// src/use-cases/cases/financial/receivable/edit-receivable.spec.ts
var import_client2 = require("@prisma/client");

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/financial/receivable/edit-receivable.ts
var EditReceivableUseCase = class {
  constructor(financialRepository2, userRepository2) {
    this.financialRepository = financialRepository2;
    this.userRepository = userRepository2;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      userId,
      clientId,
      receivableId,
      amountToReceive,
      serviceEndDate,
      serviceProvided,
      serviceStartDate
    }) {
      const userAlreadyExist = yield this.userRepository.getUserById(userId);
      if (!userAlreadyExist) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const financialExists = yield this.financialRepository.getFinancial(userId);
      if ((financialExists == null ? void 0 : financialExists.userId) !== userId) {
        throw new ErrorHandler(400, "Unauthorized, Only owner can edit");
      }
      const clientExist = yield this.financialRepository.getClientById(clientId);
      if (!clientExist) {
        throw new ErrorHandler(400, "Client Not Found, try again");
      }
      const receivable2 = yield this.financialRepository.editReceivable(
        receivableId,
        {
          amountToReceive,
          serviceEndDate,
          serviceProvided,
          serviceStartDate,
          clientId: clientExist.id,
          financialRegistrationId: financialExists.id
        }
      );
      return receivable2;
    });
  }
};

// src/use-cases/cases/financial/receivable/edit-receivable.spec.ts
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
      const financialRegistration2 = {
        id: Math.random().toString(),
        userId
      };
      this.financialRegistrations.push(financialRegistration2);
      return financialRegistration2;
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
      return this.clients.find((client2) => client2.id === id) || null;
    });
  }
  editClient(clientId, data) {
    return __async(this, null, function* () {
      const index = this.clients.findIndex((client2) => client2.id === clientId);
      if (index === -1) {
        throw new Error("Client not found");
      }
      this.clients[index] = __spreadValues(__spreadValues({}, this.clients[index]), data);
      return this.clients[index];
    });
  }
  deleteClient(clientId) {
    return __async(this, null, function* () {
      const index = this.clients.findIndex((client2) => client2.id === clientId);
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
        (client2) => client2.financialRegistrationId === id
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
        (receivable2) => receivable2.id === receivableId
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
      return this.receivables.find((receivable2) => receivable2.id === id) || null;
    });
  }
  deleteReceivable(receivableId) {
    return __async(this, null, function* () {
      const index = this.receivables.findIndex(
        (receivable2) => receivable2.id === receivableId
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
        (receivable2) => receivable2.financialRegistrationId === id
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

// src/use-cases/cases/financial/receivable/edit-receivable.spec.ts
var financialRepository;
var userRepository;
var sut;
(0, import_vitest.beforeEach)(() => {
  financialRepository = new InMemoryFinancialRepository();
  userRepository = new InMemoryUserRepository();
  sut = new EditReceivableUseCase(financialRepository, userRepository);
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
var financialRegistration = {
  id: "financial-id-1",
  userId: user.id
};
var client = {
  id: chance.guid({ version: 4 }),
  address: chance.address(),
  email: chance.email(),
  name: chance.name(),
  phone: chance.phone(),
  type: import_client2.ClientType.CLIENT,
  financialRegistrationId: financialRegistration.id
};
var receivable = {
  id: "receivable-id-1",
  amountToReceive: 1e3,
  serviceStartDate: /* @__PURE__ */ new Date("2023-01-01"),
  serviceEndDate: /* @__PURE__ */ new Date("2023-12-31"),
  serviceProvided: "Consulting",
  clientId: client.id,
  financialRegistrationId: financialRegistration.id
};
(0, import_vitest.describe)("EditReceivableUseCase", () => {
  (0, import_vitest.it)("should edit a receivable successfully", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    import_vitest.vi.spyOn(financialRepository, "getFinancial").mockResolvedValue(
      financialRegistration
    );
    import_vitest.vi.spyOn(financialRepository, "getClientById").mockResolvedValue(client);
    import_vitest.vi.spyOn(financialRepository, "editReceivable").mockResolvedValue(__spreadProps(__spreadValues({}, receivable), {
      amountToReceive: 1500,
      serviceStartDate: /* @__PURE__ */ new Date("2023-02-01")
    }));
    const result = yield sut.execute({
      userId: user.id,
      clientId: client.id,
      receivableId: receivable.id,
      amountToReceive: 1500,
      serviceStartDate: /* @__PURE__ */ new Date("2023-02-01"),
      serviceEndDate: /* @__PURE__ */ new Date("2023-12-31"),
      serviceProvided: "Consulting Services"
    });
    (0, import_vitest.expect)(result).toEqual(__spreadProps(__spreadValues({}, receivable), {
      amountToReceive: 1500,
      serviceStartDate: /* @__PURE__ */ new Date("2023-02-01"),
      serviceProvided: "Consulting Services"
    }));
    (0, import_vitest.expect)(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    (0, import_vitest.expect)(financialRepository.getFinancial).toHaveBeenCalledWith(user.id);
    (0, import_vitest.expect)(financialRepository.getClientById).toHaveBeenCalledWith(client.id);
    (0, import_vitest.expect)(financialRepository.editReceivable).toHaveBeenCalledWith(
      receivable.id,
      {
        amountToReceive: 1500,
        serviceStartDate: /* @__PURE__ */ new Date("2023-02-01"),
        serviceEndDate: /* @__PURE__ */ new Date("2023-12-31"),
        serviceProvided: "Consulting Services",
        clientId: client.id,
        financialRegistrationId: financialRegistration.id
      }
    );
  }));
  (0, import_vitest.it)("should throw an error if user is not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(null);
    yield (0, import_vitest.expect)(
      sut.execute({
        userId: user.id,
        clientId: client.id,
        receivableId: receivable.id,
        amountToReceive: 1500,
        serviceStartDate: /* @__PURE__ */ new Date("2023-02-01"),
        serviceEndDate: /* @__PURE__ */ new Date("2023-12-31"),
        serviceProvided: "Consulting Services"
      })
    ).rejects.toThrow(new ErrorHandler(400, "User Not Found, try again"));
  }));
  (0, import_vitest.it)("should throw an error if financial registration is not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    import_vitest.vi.spyOn(financialRepository, "getFinancial").mockResolvedValue(null);
    yield (0, import_vitest.expect)(
      sut.execute({
        userId: user.id,
        clientId: client.id,
        receivableId: receivable.id,
        amountToReceive: 1500,
        serviceStartDate: /* @__PURE__ */ new Date("2023-02-01"),
        serviceEndDate: /* @__PURE__ */ new Date("2023-12-31"),
        serviceProvided: "Consulting Services"
      })
    ).rejects.toThrow(new ErrorHandler(400, "Financial Not Found, try again"));
  }));
  (0, import_vitest.it)("should throw an error if client is not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    import_vitest.vi.spyOn(financialRepository, "getFinancial").mockResolvedValue(
      financialRegistration
    );
    import_vitest.vi.spyOn(financialRepository, "getClientById").mockResolvedValue(null);
    yield (0, import_vitest.expect)(
      sut.execute({
        userId: user.id,
        clientId: client.id,
        receivableId: receivable.id,
        amountToReceive: 1500,
        serviceStartDate: /* @__PURE__ */ new Date("2023-02-01"),
        serviceEndDate: /* @__PURE__ */ new Date("2023-12-31"),
        serviceProvided: "Consulting Services"
      })
    ).rejects.toThrow(new ErrorHandler(400, "Client Not Found, try again"));
  }));
  (0, import_vitest.it)("should throw an error if user is not the owner of the financial registration", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    import_vitest.vi.spyOn(financialRepository, "getFinancial").mockResolvedValue({
      id: "financial-id-2",
      userId: "other-user-id"
    });
    yield (0, import_vitest.expect)(
      sut.execute({
        userId: user.id,
        clientId: client.id,
        receivableId: receivable.id,
        amountToReceive: 1500,
        serviceStartDate: /* @__PURE__ */ new Date("2023-02-01"),
        serviceEndDate: /* @__PURE__ */ new Date("2023-12-31"),
        serviceProvided: "Consulting Services"
      })
    ).rejects.toThrow(
      new ErrorHandler(400, "Unauthorized, Only owner can edit")
    );
  }));
});
