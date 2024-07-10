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
  getUser(user) {
    return __async(this, null, function* () {
      return this.users.find((u) => u.email === user.email) || null;
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
  deleteUser(user) {
    return __async(this, null, function* () {
      this.users = this.users.filter((u) => u.email !== user.email);
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

// src/use-cases/cases/room/remove-user-to-chat-room.spec.ts
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

// src/use-cases/cases/room/remove-user-to-chat-room.ts
var RemoveUserToRoomUseCase = class {
  constructor(notificationRepository2, notificationService2, roomRepository2, userRepository2) {
    this.notificationRepository = notificationRepository2;
    this.notificationService = notificationService2;
    this.roomRepository = roomRepository2;
    this.userRepository = userRepository2;
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
  send(data2) {
    return __async(this, null, function* () {
    });
  }
};

// src/use-cases/cases/room/remove-user-to-chat-room.spec.ts
var chance = new import_chance.default();
var notificationRepository;
var notificationService;
var roomRepository;
var userRepository;
var sut;
(0, import_vitest.beforeEach)(() => {
  notificationRepository = new InMemoryNotificationRepository();
  notificationService = new SendNotification();
  roomRepository = new InMemoryRoomRepository();
  userRepository = new InMemoryUserRepository();
  sut = new RemoveUserToRoomUseCase(
    notificationRepository,
    notificationService,
    roomRepository,
    userRepository
  );
});
var data = {
  ownerId: chance.string({ numeric: true }),
  userId: chance.string({ numeric: true }),
  roomId: chance.string({ numeric: true })
};
(0, import_vitest.describe)("Remove User to Room Use Case Test", () => {
  const user = {
    id: data.ownerId,
    name: chance.name(),
    email: chance.email(),
    phone: chance.phone(),
    gender: chance.gender(),
    dateBirth: chance.date().toISOString(),
    password: chance.guid({ version: 4 })
  };
  (0, import_vitest.it)("should successfully remove user from room", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    const room = {
      id: chance.string(),
      name: chance.string(),
      ownerId: data.ownerId,
      updatedAt: chance.date(),
      createdAt: chance.date()
    };
    import_vitest.vi.spyOn(roomRepository, "getById").mockResolvedValue(room);
    const result = yield sut.execute(data.roomId, data.userId, data.ownerId);
    (0, import_vitest.expect)(result).toBeUndefined();
    (0, import_vitest.expect)(roomRepository.getById).toHaveBeenCalledWith(data.roomId);
    (0, import_vitest.expect)(userRepository.getUserById).toHaveBeenCalledWith(data.userId);
  }));
  (0, import_vitest.it)("should return error, owner not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(null);
    yield (0, import_vitest.expect)(
      sut.execute(data.roomId, data.userId, data.ownerId)
    ).rejects.toThrow(new ErrorHandler(400, "User Not Found, try again"));
  }));
  (0, import_vitest.it)("should return error, room not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    import_vitest.vi.spyOn(roomRepository, "getById").mockResolvedValue(null);
    yield (0, import_vitest.expect)(
      sut.execute(data.roomId, data.userId, data.ownerId)
    ).rejects.toThrow(new ErrorHandler(400, "Room Not Found, try again"));
  }));
  (0, import_vitest.it)("should return error, user removed is not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockImplementationOnce(() => Promise.resolve(user)).mockImplementationOnce(() => Promise.resolve(null));
    const room = {
      id: chance.string(),
      name: chance.string(),
      ownerId: data.ownerId,
      updatedAt: chance.date(),
      createdAt: chance.date()
    };
    import_vitest.vi.spyOn(roomRepository, "getById").mockResolvedValue(room);
    yield (0, import_vitest.expect)(
      sut.execute(data.roomId, data.userId, data.ownerId)
    ).rejects.toThrow(new ErrorHandler(400, "User Not Found, try again"));
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
    yield (0, import_vitest.expect)(
      sut.execute(data.roomId, data.userId, data.ownerId)
    ).rejects.toThrow(
      new ErrorHandler(400, "Unauthorized, Only owner can delete the Room")
    );
  }));
});
