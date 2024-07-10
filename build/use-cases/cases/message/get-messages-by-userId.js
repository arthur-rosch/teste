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

// src/use-cases/cases/message/get-messages-by-userId.ts
var get_messages_by_userId_exports = {};
__export(get_messages_by_userId_exports, {
  GetMessagesByUserId: () => GetMessagesByUserId
});
module.exports = __toCommonJS(get_messages_by_userId_exports);

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetMessagesByUserId
});
