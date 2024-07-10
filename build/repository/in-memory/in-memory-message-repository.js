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

// src/repository/in-memory/in-memory-message-repository.ts
var in_memory_message_repository_exports = {};
__export(in_memory_message_repository_exports, {
  InMemoryMessageRepository: () => InMemoryMessageRepository
});
module.exports = __toCommonJS(in_memory_message_repository_exports);
var InMemoryMessageRepository = class {
  constructor() {
    this.messages = [];
    this.idCounter = 1;
  }
  saveMessage(data) {
    return __async(this, null, function* () {
      const newMessage = __spreadProps(__spreadValues({}, data), {
        id: this.idCounter.toString()
      });
      this.messages.push(newMessage);
      this.idCounter++;
    });
  }
  getMessagesByChatId(data) {
    return __async(this, null, function* () {
      const messages = this.messages.filter((msg) => msg.chatId === data.chatId);
      return messages;
    });
  }
  getMessagesByUserId(data) {
    return __async(this, null, function* () {
      const messages = this.messages.filter((msg) => msg.userId === data.userId);
      return messages;
    });
  }
  getAllMessages() {
    return __async(this, null, function* () {
      return this.messages;
    });
  }
  getChatId(data) {
    return __async(this, null, function* () {
      const message = this.messages.find((msg) => msg.chatId === data.chatId);
      return message || null;
    });
  }
  getUserId(data) {
    return __async(this, null, function* () {
      const message = this.messages.find((msg) => msg.userId === data.userId);
      return message || null;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryMessageRepository
});
