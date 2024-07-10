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

// src/repository/prisma/prisma-message-repository.ts
var prisma_message_repository_exports = {};
__export(prisma_message_repository_exports, {
  MessageRepository: () => MessageRepository
});
module.exports = __toCommonJS(prisma_message_repository_exports);
var MessageRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MessageRepository
});
