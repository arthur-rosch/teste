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

// src/repository/in-memory/in-memory-user-repository.ts
var import_crypto = require("crypto");
var InMemoryUserRepository = class {
  constructor() {
    this.users = [];
  }
  create(data2) {
    return __async(this, null, function* () {
      const newUser = {
        id: (0, import_crypto.randomUUID)(),
        name: data2.name,
        email: data2.email,
        phone: data2.phone,
        gender: data2.gender,
        dateBirth: data2.dateBirth,
        password: data2.password
      };
      this.users.push(newUser);
      return newUser;
    });
  }
  getUser(user2) {
    return __async(this, null, function* () {
      return this.users.find((u) => u.email === user2.email) || null;
    });
  }
  getUserById(userId) {
    return __async(this, null, function* () {
      return this.users.find((u) => u.id === userId) || null;
    });
  }
  editUser(data2) {
    return __async(this, null, function* () {
      const userIndex = this.users.findIndex((u) => u.id === data2.id);
      this.users[userIndex] = __spreadValues(__spreadValues({}, this.users[userIndex]), data2);
    });
  }
  deleteUser(user2) {
    return __async(this, null, function* () {
      this.users = this.users.filter((u) => u.email !== user2.email);
    });
  }
  getManyUsersByEmail(emails) {
    return __async(this, null, function* () {
      return this.users.filter((u) => emails.includes(u.email));
    });
  }
  changePassword(data2) {
    return __async(this, null, function* () {
      const userIndex = this.users.findIndex((u) => u.email === data2.email);
      if (userIndex !== -1) {
        this.users[userIndex] = __spreadProps(__spreadValues({}, this.users[userIndex]), {
          password: data2.password || ""
        });
      }
    });
  }
  getAllUsers() {
    return __async(this, null, function* () {
      return this.users;
    });
  }
};

// src/repository/in-memory/in-memory-room-repository.ts
var InMemoryRoomRepository = class {
  constructor() {
    this.rooms = {};
    this.usersInRooms = {};
    this.videoRooms = [];
  }
  create(data2) {
    return __async(this, null, function* () {
      var _a, _b;
      const id = (Math.random() * 1e4).toFixed(0);
      const createdAt = /* @__PURE__ */ new Date();
      const updatedAt = createdAt;
      const room = __spreadProps(__spreadValues({}, data2), {
        id,
        createdAt,
        updatedAt,
        ownerId: ((_b = (_a = data2.owner) == null ? void 0 : _a.connect) == null ? void 0 : _b.id) || ""
      });
      this.rooms[id] = room;
      this.usersInRooms[id] = /* @__PURE__ */ new Set();
      return room;
    });
  }
  getById(roomId) {
    return __async(this, null, function* () {
      return this.rooms[roomId] || null;
    });
  }
  update(name, roomId) {
    return __async(this, null, function* () {
      if (this.rooms[roomId]) {
        this.rooms[roomId].name = name;
      }
    });
  }
  delete(roomId) {
    return __async(this, null, function* () {
      delete this.rooms[roomId];
      delete this.usersInRooms[roomId];
    });
  }
  addUserToChat(roomId, userId) {
    return __async(this, null, function* () {
      if (this.usersInRooms[roomId]) {
        this.usersInRooms[roomId].add(userId);
      }
    });
  }
  removeUserFromChat(roomId, userId) {
    return __async(this, null, function* () {
      if (this.usersInRooms[roomId]) {
        this.usersInRooms[roomId].delete(userId);
      }
    });
  }
  createVideoRoom(ownerId, roomId, roomLink) {
    return __async(this, null, function* () {
      const newVideoRoom = {
        id: (Math.random() * 1e4).toFixed(0),
        ownerId,
        roomId,
        roomLink
      };
      this.videoRooms.push(newVideoRoom);
      return newVideoRoom;
    });
  }
};

// src/repository/in-memory/in-memory-notification-repository.ts
var InMemoryNotificationRepository = class {
  constructor() {
    this.notifications = [];
  }
  create(data2) {
    return __async(this, null, function* () {
      const newNotification = __spreadProps(__spreadValues({}, data2), {
        id: (this.notifications.length + 1).toString()
      });
      this.notifications.push(newNotification);
      return newNotification;
    });
  }
  getUserId(userId) {
    return __async(this, null, function* () {
      return this.notifications.find(
        (notification) => notification.userId === userId
      ) || null;
    });
  }
  updateReadyNotification(notificationId, ready) {
    return __async(this, null, function* () {
      const notification = this.notifications.find(
        (notification2) => notification2.id === notificationId
      );
      notification.isRead = ready;
    });
  }
};

// src/use-cases/cases/room/delete.spec.ts
var import_chance = __toESM(require("chance"));
var import_vitest = require("vitest");

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/room/delete.ts
var DeleteRoomUseCase = class {
  constructor(notificationRepository2, notificationService2, chatRepository2, roomRepository2, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.chatRepository = chatRepository2;
    this.roomRepository = roomRepository2;
    this.userRepository = userRepository2;
  }
  execute(roomId, userId) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(userId);
      if (!owner) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const existingRoom = yield this.roomRepository.getById(roomId);
      if (!existingRoom) {
        throw new ErrorHandler(400, "Room Not Found, try again");
      }
      if (existingRoom.ownerId !== owner.id) {
        throw new ErrorHandler(
          400,
          "Unauthorized, Only owner can delete the Room"
        );
      }
      const { id } = yield this.chatRepository.getByRoomId(roomId);
      const notificationParams = {
        userId: owner.id,
        senderId: owner.id,
        message: `Voc\xEA acabou de deletar a sala ${existingRoom.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      yield this.chatRepository.delete(id);
      yield this.roomRepository.delete(roomId);
    });
  }
};

// src/repository/in-memory/in-memory-chat-repository.ts
var InMemoryChatRepository = class {
  constructor() {
    this.chats = {};
  }
  delete(chatId) {
    return __async(this, null, function* () {
      delete this.chats[chatId];
    });
  }
  create(data2) {
    return __async(this, null, function* () {
      const id = (Math.random() * 1e4).toFixed(0);
      const createdAt = /* @__PURE__ */ new Date();
      const updatedAt = createdAt;
      const chat = __spreadProps(__spreadValues({}, data2), { id, createdAt, updatedAt });
      this.chats[id] = chat;
      return chat;
    });
  }
  getById(id) {
    return __async(this, null, function* () {
      return this.chats[id] || null;
    });
  }
  getByRoomId(chatRoomId) {
    return __async(this, null, function* () {
      const chat = Object.values(this.chats).find(
        (chat2) => chat2.roomId === chatRoomId
      );
      return chat || null;
    });
  }
};

// src/service/sendNotification.ts
var SendNotification = class {
  send(data2) {
    return __async(this, null, function* () {
    });
  }
};

// src/use-cases/cases/room/delete.spec.ts
var chance = new import_chance.default();
var notificationRepository;
var notificationService;
var chatRepository;
var roomRepository;
var userRepository;
var sut;
(0, import_vitest.beforeEach)(() => {
  notificationRepository = new InMemoryNotificationRepository();
  notificationService = new SendNotification();
  chatRepository = new InMemoryChatRepository();
  roomRepository = new InMemoryRoomRepository();
  userRepository = new InMemoryUserRepository();
  sut = new DeleteRoomUseCase(
    notificationRepository,
    notificationService,
    chatRepository,
    roomRepository,
    userRepository
  );
});
var data = {
  owner: chance.string(),
  userId: chance.string({ numeric: true }),
  roomId: chance.string({ numeric: true })
};
var user = {
  id: data.owner,
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 })
};
(0, import_vitest.describe)("Delete Room Use Case Test", () => {
  (0, import_vitest.it)("should delete a room successfully", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    const room = {
      id: chance.string(),
      name: chance.string(),
      ownerId: data.owner,
      updatedAt: chance.date(),
      createdAt: chance.date()
    };
    import_vitest.vi.spyOn(roomRepository, "getById").mockResolvedValue(room);
    const chat = {
      id: chance.guid({ version: 4 })
    };
    import_vitest.vi.spyOn(chatRepository, "getByRoomId").mockResolvedValue(chat);
    const result = yield sut.execute(data.roomId, data.userId);
    (0, import_vitest.expect)(result).toBeUndefined();
    (0, import_vitest.expect)(roomRepository.getById).toHaveBeenCalledWith(data.roomId);
    (0, import_vitest.expect)(userRepository.getUserById).toHaveBeenCalledWith(data.userId);
  }));
  (0, import_vitest.it)("should return error, user not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(null);
    yield (0, import_vitest.expect)(sut.execute(data.roomId, data.userId)).rejects.toThrow(
      new ErrorHandler(400, "User Not Found, try again")
    );
  }));
  (0, import_vitest.it)("should return error, room not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    import_vitest.vi.spyOn(roomRepository, "getById").mockResolvedValue(null);
    yield (0, import_vitest.expect)(sut.execute(data.roomId, data.userId)).rejects.toThrow(
      new ErrorHandler(400, "Room Not Found, try again")
    );
  }));
  (0, import_vitest.it)("should return error, unauthorized user", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    const room = {
      id: chance.string(),
      name: chance.string(),
      ownerId: chance.string(),
      updatedAt: chance.date(),
      createdAt: chance.date()
    };
    import_vitest.vi.spyOn(roomRepository, "getById").mockResolvedValue(room);
    yield (0, import_vitest.expect)(sut.execute(data.roomId, data.userId)).rejects.toThrow(
      new ErrorHandler(400, "Unauthorized, Only owner can delete the Room")
    );
  }));
});
