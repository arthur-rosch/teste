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

// src/use-cases/cases/room/add-video-room.ts
var add_video_room_exports = {};
__export(add_video_room_exports, {
  AddVideoRoomUseCase: () => AddVideoRoomUseCase
});
module.exports = __toCommonJS(add_video_room_exports);

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
  constructor(roomRepository, userRepository) {
    this.roomRepository = roomRepository;
    this.userRepository = userRepository;
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
      const videoRoom = this.roomRepository.createVideoRoom(
        ownerId,
        roomId,
        roomLink
      );
      return videoRoom;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AddVideoRoomUseCase
});
