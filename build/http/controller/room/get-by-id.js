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

// src/http/controller/room/get-by-id.ts
var get_by_id_exports = {};
__export(get_by_id_exports, {
  getRoomByIdController: () => getRoomByIdController
});
module.exports = __toCommonJS(get_by_id_exports);

// src/use-cases/factories/room/make-find-by-id.ts
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
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
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

// src/use-cases/factories/room/make-find-by-id.ts
function makeGetRoomByIdUseCase() {
  const prisma = new import_client.PrismaClient();
  const roomRepository = new RoomRepository(prisma);
  return new GetRoomByIdUseCase(roomRepository);
}

// src/http/controller/room/get-by-id.ts
var import_zod2 = require("zod");
var getRoomByIdController = (req, res, next) => __async(void 0, null, function* () {
  const paramsSchema = import_zod2.z.object({
    roomId: import_zod2.z.string()
  });
  try {
    const { roomId } = paramsSchema.parse(req.params);
    const getRoomByIdUseCase = makeGetRoomByIdUseCase();
    const room = yield getRoomByIdUseCase.execute(roomId);
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRoomByIdController
});
