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

// src/use-cases/cases/room/add-video-room.spec.ts
var import_chance = __toESM(require("chance"));

// src/repository/in-memory/in-memory-user-repository.ts
var import_crypto = require("crypto");
var InMemoryUserRepository = class {
  constructor() {
    this.users = [];
  }
  create(data) {
    return __async(this, null, function* () {
      const newUser = {
        id: (0, import_crypto.randomUUID)(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateBirth: data.dateBirth,
        password: data.password
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
  editUser(data) {
    return __async(this, null, function* () {
      const userIndex = this.users.findIndex((u) => u.id === data.id);
      this.users[userIndex] = __spreadValues(__spreadValues({}, this.users[userIndex]), data);
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
  changePassword(data) {
    return __async(this, null, function* () {
      const userIndex = this.users.findIndex((u) => u.email === data.email);
      if (userIndex !== -1) {
        this.users[userIndex] = __spreadProps(__spreadValues({}, this.users[userIndex]), {
          password: data.password || ""
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
  create(data) {
    return __async(this, null, function* () {
      var _a, _b;
      const id = (Math.random() * 1e4).toFixed(0);
      const createdAt = /* @__PURE__ */ new Date();
      const updatedAt = createdAt;
      const room2 = __spreadProps(__spreadValues({}, data), {
        id,
        createdAt,
        updatedAt,
        ownerId: ((_b = (_a = data.owner) == null ? void 0 : _a.connect) == null ? void 0 : _b.id) || ""
      });
      this.rooms[id] = room2;
      this.usersInRooms[id] = /* @__PURE__ */ new Set();
      return room2;
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

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/room/add-video-room.ts
var AddVideoRoomUseCase = class {
  constructor(roomRepository2, userRepository2) {
    this.roomRepository = roomRepository2;
    this.userRepository = userRepository2;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { ownerId, roomId, roomLink } = data;
      const ownerAlreadyExists = yield this.userRepository.getUserById(ownerId);
      if (!ownerAlreadyExists) {
        throw new ErrorHandler(400, "User Not Found, try again");
      }
      const roomExists = yield this.roomRepository.getById(roomId);
      if (!roomExists) {
        throw new ErrorHandler(400, "Room Not Found, try again");
      }
      const videoRoom2 = this.roomRepository.createVideoRoom(
        ownerId,
        roomId,
        roomLink
      );
      return videoRoom2;
    });
  }
};

// src/use-cases/cases/room/add-video-room.spec.ts
var import_vitest = require("vitest");
var chance = new import_chance.default();
var roomRepository;
var userRepository;
var sut;
(0, import_vitest.beforeEach)(() => {
  roomRepository = new InMemoryRoomRepository();
  userRepository = new InMemoryUserRepository();
  sut = new AddVideoRoomUseCase(roomRepository, userRepository);
});
var userReturn = {
  id: chance.guid({ version: 4 }),
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 })
};
var room = {
  id: chance.string(),
  name: chance.string(),
  ownerId: userReturn.id,
  updatedAt: chance.date(),
  createdAt: chance.date()
};
var videoRoom = {
  ownerId: userReturn.id,
  roomId: room.id,
  roomLink: chance.word({ length: 10 })
};
(0, import_vitest.describe)("Add Video Room Use Case Test", () => {
  (0, import_vitest.it)("should return to the new registered video room", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(userReturn);
    import_vitest.vi.spyOn(roomRepository, "getById").mockResolvedValue(room);
    const result = yield sut.execute(videoRoom);
    (0, import_vitest.expect)(result).toEqual(__spreadProps(__spreadValues({}, videoRoom), {
      id: import_vitest.expect.any(String)
    }));
    (0, import_vitest.expect)(userRepository.getUserById).toHaveBeenCalledWith(userReturn.id);
    (0, import_vitest.expect)(roomRepository.getById).toHaveBeenCalledWith(room.id);
  }));
  (0, import_vitest.it)("should return error, user not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(null);
    yield (0, import_vitest.expect)(sut.execute(videoRoom)).rejects.toThrow(
      new ErrorHandler(400, "User Not Found, try again")
    );
    (0, import_vitest.expect)(userRepository.getUserById).toHaveBeenCalledWith(userReturn.id);
  }));
  (0, import_vitest.it)("should return error, room not found", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUserById").mockResolvedValue(userReturn);
    import_vitest.vi.spyOn(roomRepository, "getById").mockResolvedValue(null);
    yield (0, import_vitest.expect)(sut.execute(videoRoom)).rejects.toThrow(
      new ErrorHandler(400, "Room Not Found, try again")
    );
    (0, import_vitest.expect)(userRepository.getUserById).toHaveBeenCalledWith(userReturn.id);
    (0, import_vitest.expect)(roomRepository.getById).toHaveBeenCalledWith(room.id);
  }));
});
