"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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

// src/use-cases/cases/room/get-by-id.spec.ts
var import_chance = require("chance");
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

// src/use-cases/cases/room/get-by-id.ts
var GetRoomByIdUseCase = class {
  constructor(roomRepository2) {
    this.roomRepository = roomRepository2;
  }
  execute(roomId) {
    return __async(this, null, function* () {
      const room = yield this.roomRepository.getById(roomId);
      if (!room) {
        throw new ErrorHandler(400, "Room Not Found, try again");
      }
      return room;
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
      const room = __spreadProps(__spreadValues({}, data), {
        id,
        createdAt,
        updatedAt,
        ownerId: ((_b = (_a = data.owner) == null ? void 0 : _a.connect) == null ? void 0 : _b.id) || ""
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

// src/use-cases/cases/room/get-by-id.spec.ts
var chance = new import_chance.Chance();
var roomRepository;
var sut;
(0, import_vitest.beforeEach)(() => {
  roomRepository = new InMemoryRoomRepository();
  sut = new GetRoomByIdUseCase(roomRepository);
});
(0, import_vitest.describe)("Get Room By Id Use Case Test", () => {
  const roomId = chance.string({ numeric: true });
  (0, import_vitest.it)("should return to the rooms successfully", () => __async(exports, null, function* () {
    const room = {
      id: roomId,
      name: chance.string(),
      ownerId: chance.string(),
      updatedAt: chance.date(),
      createdAt: chance.date()
    };
    import_vitest.vi.spyOn(roomRepository, "getById").mockResolvedValue(room);
    const result = yield sut.execute(roomId);
    (0, import_vitest.expect)(result).toEqual(room);
    (0, import_vitest.expect)(roomRepository.getById).toHaveBeenCalledWith(roomId);
  }));
  (0, import_vitest.it)("should return error, room does not exist", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(roomRepository, "getById").mockResolvedValue(null);
    yield (0, import_vitest.expect)(sut.execute(roomId)).rejects.toThrow(
      new ErrorHandler(400, "Room Not Found, try again")
    );
  }));
});
