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

// src/repository/prisma/prisma-room-repository.ts
var prisma_room_repository_exports = {};
__export(prisma_room_repository_exports, {
  RoomRepository: () => RoomRepository
});
module.exports = __toCommonJS(prisma_room_repository_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RoomRepository
});
