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

// src/use-cases/factories/room/make-create-room.ts
var make_create_room_exports = {};
__export(make_create_room_exports, {
  makeCreateRoomUseCase: () => makeCreateRoomUseCase
});
module.exports = __toCommonJS(make_create_room_exports);
var import_client = require("@prisma/client");

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/room/create.ts
var CreateRoomUseCase = class {
  constructor(notificationRepository, notificationService, roomRepository, userRepository, chatRepository) {
    this.notificationRepository = notificationRepository;
    this.notificationService = notificationService;
    this.roomRepository = roomRepository;
    this.userRepository = userRepository;
    this.chatRepository = chatRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(data.ownerId);
      if (!owner) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const createdRoom = yield this.roomRepository.create(data);
      yield this.chatRepository.create({
        roomId: createdRoom.id
      });
      const notificationParams = {
        userId: owner.id,
        senderId: owner.id,
        message: `Voc\xEA acabou de criar a sala ${data.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      return createdRoom;
    });
  }
};

// src/repository/prisma/prisma-room-repository.ts
var RoomRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  create(data) {
    return __async(this, null, function* () {
      const createRoom = yield this.prisma.room.create({
        data
      });
      return createRoom;
    });
  }
  getById(roomId) {
    return __async(this, null, function* () {
      const room = yield this.prisma.room.findUnique({
        where: {
          id: roomId
        }
      });
      return room;
    });
  }
  update(name, roomId) {
    return __async(this, null, function* () {
      yield this.prisma.room.update({
        where: {
          id: roomId
        },
        data: {
          name
        }
      });
    });
  }
  delete(roomId) {
    return __async(this, null, function* () {
      yield this.prisma.room.delete({
        where: {
          id: roomId
        }
      });
    });
  }
  addUserToChat(roomId, userId) {
    return __async(this, null, function* () {
      yield this.prisma.room.update({
        where: {
          id: roomId
        },
        data: {
          users: {
            connect: {
              id: userId
            }
          }
        }
      });
    });
  }
  removeUserFromChat(roomId, userId) {
    return __async(this, null, function* () {
      yield this.prisma.room.update({
        where: {
          id: roomId
        },
        data: {
          users: {
            disconnect: {
              id: userId
            }
          }
        }
      });
    });
  }
  createVideoRoom(ownerId, roomId, roomLink) {
    return __async(this, null, function* () {
      return yield this.prisma.videoRoom.create({
        data: {
          ownerId,
          roomId,
          roomLink
        }
      });
    });
  }
};

// src/repository/prisma/prisma-user-repository.ts
var UserRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getManyUsersByEmail(emails) {
    return __async(this, null, function* () {
      const users = yield this.prisma.user.findMany({
        where: {
          email: {
            in: emails
          }
        }
      });
      return users;
    });
  }
  create(data) {
    return __async(this, null, function* () {
      const { name, email, phone, gender, dateBirth, password } = data;
      const createUser = yield this.prisma.user.create({
        data: {
          name,
          email,
          phone,
          gender,
          dateBirth,
          password
        }
      });
      return createUser;
    });
  }
  getUser(user) {
    return __async(this, null, function* () {
      const findUser = yield this.prisma.user.findFirst({
        where: {
          email: user.email
        }
      });
      return findUser;
    });
  }
  getUserById(userId) {
    return __async(this, null, function* () {
      const findUser = yield this.prisma.user.findUnique({
        where: {
          id: userId
        }
      });
      if (!findUser) {
        return null;
      }
      return findUser;
    });
  }
  editUser(data) {
    return __async(this, null, function* () {
      yield this.prisma.user.update({
        where: {
          email: data.email
        },
        data
      });
    });
  }
  deleteUser(user) {
    return __async(this, null, function* () {
      yield this.prisma.user.delete({
        where: {
          email: user.email
        }
      });
    });
  }
  changePassword(data) {
    return __async(this, null, function* () {
      const { email, password } = data;
      yield this.prisma.user.update({
        where: {
          email
        },
        data: {
          password
        }
      });
    });
  }
  getAllUsers() {
    return __async(this, null, function* () {
      const users = yield this.prisma.user.findMany();
      return users.length > 0 ? users : null;
    });
  }
};

// src/repository/prisma/prisma-notification-repository.ts
var NotificationRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  create(data) {
    return __async(this, null, function* () {
      return yield this.prisma.notification.create({ data });
    });
  }
  getUserId(userId) {
    return __async(this, null, function* () {
      return yield this.prisma.notification.findFirst({
        where: {
          userId
        }
      });
    });
  }
  updateReadyNotification(notificationId, ready) {
    return __async(this, null, function* () {
      yield this.prisma.notification.update({
        where: {
          id: notificationId
        },
        data: {
          isRead: ready
        }
      });
    });
  }
};

// src/repository/prisma/prisma-chat-repository.ts
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

// src/service/sendNotification.ts
var SendNotification = class {
  send(data) {
    return __async(this, null, function* () {
    });
  }
};

// src/use-cases/factories/room/make-create-room.ts
function makeCreateRoomUseCase() {
  const prisma = new import_client.PrismaClient();
  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const roomRepository = new RoomRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const chatRepository = new ChatRepository(prisma);
  return new CreateRoomUseCase(notificationRepository, notificationService, roomRepository, userRepository, chatRepository);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeCreateRoomUseCase
});
