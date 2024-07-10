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

// src/repository/prisma/prisma-chat-repository.ts
var prisma_chat_repository_exports = {};
__export(prisma_chat_repository_exports, {
  ChatRepository: () => ChatRepository
});
module.exports = __toCommonJS(prisma_chat_repository_exports);
var ChatRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChatRepository
});
