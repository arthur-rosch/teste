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

// src/repository/prisma/prisma-financial-repository.ts
var prisma_financial_repository_exports = {};
__export(prisma_financial_repository_exports, {
  FinancialRepository: () => FinancialRepository
});
module.exports = __toCommonJS(prisma_financial_repository_exports);
var FinancialRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  createFinancial(userId) {
    return __async(this, null, function* () {
      return yield this.prisma.financialRegistration.create({
        data: {
          userId
        }
      });
    });
  }
  getFinancial(userId) {
    return __async(this, null, function* () {
      return yield this.prisma.financialRegistration.findFirst({
        where: {
          userId
        }
      });
    });
  }
  createClient(params) {
    return __async(this, null, function* () {
      return yield this.prisma.client.create({ data: params });
    });
  }
  getClientById(id) {
    return __async(this, null, function* () {
      return yield this.prisma.client.findUnique({
        where: {
          id
        }
      });
    });
  }
  editClient(clientId, data) {
    return __async(this, null, function* () {
      return yield this.prisma.client.update({
        where: { id: clientId },
        data
      });
    });
  }
  deleteClient(clientId) {
    return __async(this, null, function* () {
      return yield this.prisma.client.delete({
        where: { id: clientId }
      });
    });
  }
  getAllClientByFinancialId(id) {
    return __async(this, null, function* () {
      const clients = yield this.prisma.client.findMany({
        where: {
          financialRegistrationId: id
        }
      });
      return clients;
    });
  }
  createExpenses(params) {
    return __async(this, null, function* () {
      return yield this.prisma.expense.create({ data: params });
    });
  }
  editExpense(expensesId, data) {
    return __async(this, null, function* () {
      return yield this.prisma.expense.update({
        where: { id: expensesId },
        data
      });
    });
  }
  getExpenseById(id) {
    return __async(this, null, function* () {
      return yield this.prisma.expense.findUnique({
        where: {
          id
        }
      });
    });
  }
  deleteExpense(expenseId) {
    return __async(this, null, function* () {
      return yield this.prisma.expense.delete({
        where: { id: expenseId }
      });
    });
  }
  getAllExpenseByFinancialId(id) {
    return __async(this, null, function* () {
      const expenses = yield this.prisma.expense.findMany({
        where: {
          financialRegistrationId: id
        }
      });
      return expenses;
    });
  }
  createReceivable(params) {
    return __async(this, null, function* () {
      return yield this.prisma.receivable.create({ data: params });
    });
  }
  editReceivable(expensesId, data) {
    return __async(this, null, function* () {
      return yield this.prisma.receivable.update({
        where: { id: expensesId },
        data
      });
    });
  }
  getReceivableById(id) {
    return __async(this, null, function* () {
      return yield this.prisma.receivable.findUnique({
        where: {
          id
        }
      });
    });
  }
  deleteReceivable(receivableId) {
    return __async(this, null, function* () {
      return yield this.prisma.receivable.delete({
        where: { id: receivableId }
      });
    });
  }
  getAllReceivableByFinancialId(id) {
    return __async(this, null, function* () {
      const receivables = yield this.prisma.receivable.findMany({
        where: {
          financialRegistrationId: id
        }
      });
      return receivables;
    });
  }
  createExtraExpense(params) {
    return __async(this, null, function* () {
      return yield this.prisma.extraExpense.create({ data: params });
    });
  }
  editExtraExpense(extraExpenseId, data) {
    return __async(this, null, function* () {
      return yield this.prisma.extraExpense.update({
        where: { id: extraExpenseId },
        data
      });
    });
  }
  getExtraExpenseById(id) {
    return __async(this, null, function* () {
      return yield this.prisma.extraExpense.findUnique({
        where: {
          id
        }
      });
    });
  }
  deleteExtraExpense(extraExpenseId) {
    return __async(this, null, function* () {
      return yield this.prisma.extraExpense.delete({
        where: { id: extraExpenseId }
      });
    });
  }
  getAllExtraExpenseByFinancialId(id) {
    return __async(this, null, function* () {
      const extraExpenses = yield this.prisma.extraExpense.findMany({
        where: {
          financialRegistrationId: id
        }
      });
      return extraExpenses;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FinancialRepository
});
