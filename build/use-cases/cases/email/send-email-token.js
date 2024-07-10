"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/use-cases/cases/email/send-email-token.ts
var send_email_token_exports = {};
__export(send_email_token_exports, {
  SendEmailTokenUseCase: () => SendEmailTokenUseCase
});
module.exports = __toCommonJS(send_email_token_exports);

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/email/send-email-token.ts
var import_chance = __toESM(require("chance"));
var chance = new import_chance.default();
var SendEmailTokenUseCase = class {
  constructor(userRepository, sendEmailTokeService, emailTokenRepository) {
    this.userRepository = userRepository;
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
      const token = chance.string({ numeric: true, length: 5 });
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SendEmailTokenUseCase
});
