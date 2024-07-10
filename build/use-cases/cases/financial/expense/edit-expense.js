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

// src/use-cases/cases/financial/expense/edit-expense.ts
var edit_expense_exports = {};
__export(edit_expense_exports, {
  EditUseCase: () => EditUseCase
});
module.exports = __toCommonJS(edit_expense_exports);

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/financial/expense/edit-expense.ts
var EditUseCase = class {
  constructor(financialRepository, userRepository) {
    this.financialRepository = financialRepository;
    this.userRepository = userRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      type,
      userId,
      amount,
      expenseId,
      recurringMonth,
      contractEndDate,
      contractStartDate,
      financialRegistrationId
    }) {
      const userAlreadyExist = yield this.userRepository.getUserById(userId);
      if (!userAlreadyExist) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const financialExists = yield this.financialRepository.getFinancial(
        financialRegistrationId
      );
      if ((financialExists == null ? void 0 : financialExists.userId) !== userId) {
        throw new ErrorHandler(400, "Unauthorized, Only owner can edit");
      }
      const expense = yield this.financialRepository.editExpense(expenseId, {
        type,
        amount,
        recurringMonth,
        contractEndDate,
        contractStartDate,
        financialRegistrationId: financialExists.id
      });
      return expense;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EditUseCase
});
