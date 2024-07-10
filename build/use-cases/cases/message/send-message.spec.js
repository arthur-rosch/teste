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

// src/use-cases/cases/message/send-message.spec.ts
var import_chance = __toESM(require("chance"));

// src/repository/in-memory/in-memory-message-repository.ts
var InMemoryMessageRepository = class {
  constructor() {
    this.messages = [];
    this.idCounter = 1;
  }
  saveMessage(data2) {
    return __async(this, null, function* () {
      const newMessage = __spreadProps(__spreadValues({}, data2), {
        id: this.idCounter.toString()
      });
      this.messages.push(newMessage);
      this.idCounter++;
    });
  }
  getMessagesByChatId(data2) {
    return __async(this, null, function* () {
      const messages = this.messages.filter((msg) => msg.chatId === data2.chatId);
      return messages;
    });
  }
  getMessagesByUserId(data2) {
    return __async(this, null, function* () {
      const messages = this.messages.filter((msg) => msg.userId === data2.userId);
      return messages;
    });
  }
  getAllMessages() {
    return __async(this, null, function* () {
      return this.messages;
    });
  }
  getChatId(data2) {
    return __async(this, null, function* () {
      const message = this.messages.find((msg) => msg.chatId === data2.chatId);
      return message || null;
    });
  }
  getUserId(data2) {
    return __async(this, null, function* () {
      const message = this.messages.find((msg) => msg.userId === data2.userId);
      return message || null;
    });
  }
};

// src/use-cases/cases/message/send-message.ts
var SendMessage = class {
  constructor(messageRepository2) {
    this.messageRepository = messageRepository2;
  }
  execute(_0) {
    return __async(this, arguments, function* ({ chatId, content, userId }) {
      yield this.messageRepository.saveMessage({
        content,
        userId,
        chatId
      });
    });
  }
};

// src/use-cases/cases/message/send-message.spec.ts
var import_vitest = require("vitest");
var chance = new import_chance.default();
var messageRepository;
var sut;
(0, import_vitest.beforeEach)(() => {
  messageRepository = new InMemoryMessageRepository();
  sut = new SendMessage(messageRepository);
});
var data = {
  content: chance.string(),
  userId: chance.string({ numeric: true }),
  chatId: chance.string({ numeric: true })
};
(0, import_vitest.describe)("Send Message Test", () => {
  (0, import_vitest.it)("should send and save message with successfully", () => __async(exports, null, function* () {
    const result = yield sut.execute({
      content: data.content,
      chatId: data.chatId,
      userId: data.userId
    });
    (0, import_vitest.expect)(result).toBeUndefined();
  }));
});
