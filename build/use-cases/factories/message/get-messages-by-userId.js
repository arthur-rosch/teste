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

// src/use-cases/factories/message/get-messages-by-userId.ts
var get_messages_by_userId_exports = {};
__export(get_messages_by_userId_exports, {
  makeGetMessagesByUserId: () => makeGetMessagesByUserId
});
module.exports = __toCommonJS(get_messages_by_userId_exports);

// src/repository/prisma/prisma-message-repository.ts
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

// src/use-cases/factories/message/get-messages-by-userId.ts
var import_client = require("@prisma/client");
function makeGetMessagesByUserId() {
  const prisma = new import_client.PrismaClient();
  const userRepository = new MessageRepository(prisma);
  const sendMessage = new GetMessagesByUserId(userRepository);
  return sendMessage;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeGetMessagesByUserId
});
