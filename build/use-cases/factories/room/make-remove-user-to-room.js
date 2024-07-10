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

// src/use-cases/factories/room/make-remove-user-to-room.ts
var make_remove_user_to_room_exports = {};
__export(make_remove_user_to_room_exports, {
  makeRemoveUserToRoomUseCase: () => makeRemoveUserToRoomUseCase
});
module.exports = __toCommonJS(make_remove_user_to_room_exports);
var import_client = require("@prisma/client");

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

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/room/remove-user-to-chat-room.ts
var RemoveUserToRoomUseCase = class {
  constructor(notificationRepository, notificationService, roomRepository, userRepository) {
    this.notificationRepository = notificationRepository;
    this.notificationService = notificationService;
    this.roomRepository = roomRepository;
    this.userRepository = userRepository;
  }
  execute(roomId, userId, ownerId) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(ownerId);
      if (!owner) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const existingRoom = yield this.roomRepository.getById(roomId);
      if (!existingRoom) {
        throw new ErrorHandler(400, "Room Not Found, try again");
      }
      const userExists = yield this.userRepository.getUserById(userId);
      if (!userExists) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      if (existingRoom.ownerId !== owner.id) {
        throw new ErrorHandler(
          400,
          "Unauthorized, Only owner can delete the Room"
        );
      }
      yield this.roomRepository.removeUserFromChat(roomId, userId);
      const notificationParams = {
        userId,
        senderId: ownerId,
        message: `Voc\xEA foi removido da sala ${existingRoom.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
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

// src/use-cases/factories/room/make-remove-user-to-room.ts
function makeRemoveUserToRoomUseCase() {
  const prisma = new import_client.PrismaClient();
  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const userRepository = new UserRepository(prisma);
  const roomRepository = new RoomRepository(prisma);
  return new RemoveUserToRoomUseCase(
    notificationRepository,
    notificationService,
    roomRepository,
    userRepository
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeRemoveUserToRoomUseCase
});
