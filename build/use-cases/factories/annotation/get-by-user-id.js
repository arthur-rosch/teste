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

// src/use-cases/factories/annotation/get-by-user-id.ts
var get_by_user_id_exports = {};
__export(get_by_user_id_exports, {
  makeGetByUserIdAnnotation: () => makeGetByUserIdAnnotation
});
module.exports = __toCommonJS(get_by_user_id_exports);

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

// src/repository/prisma/prisma-annotation-repository.ts
var AnnotationRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  delete(annotationId) {
    return __async(this, null, function* () {
      const annotationDeleted = yield this.prisma.annotation.delete({
        where: {
          id: annotationId
        }
      });
      return annotationDeleted;
    });
  }
  getByUserId(userId) {
    return __async(this, null, function* () {
      return yield this.prisma.annotation.findMany({
        where: {
          userId
        }
      });
    });
  }
  getById(id) {
    return __async(this, null, function* () {
      return yield this.prisma.annotation.findUnique({
        where: {
          id
        }
      });
    });
  }
  create(data) {
    return __async(this, null, function* () {
      const annotation = yield this.prisma.annotation.create({
        data
      });
      return annotation;
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

// src/use-cases/cases/annotation/get-by-user-id.ts
var GetByUserIdUseCase = class {
  constructor(annotationRepository, userRepository) {
    this.annotationRepository = annotationRepository;
    this.userRepository = userRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({ userId }) {
      const user = yield this.userRepository.getUserById(userId);
      if (!user) {
        throw new ErrorHandler(400, "User not found, try again");
      }
      const annotations = yield this.annotationRepository.getByUserId(userId);
      return annotations;
    });
  }
};

// src/use-cases/factories/annotation/get-by-user-id.ts
var import_client = require("@prisma/client");
function makeGetByUserIdAnnotation() {
  const prisma = new import_client.PrismaClient();
  const annotationRepository = new AnnotationRepository(prisma);
  const userRepository = new UserRepository(prisma);
  return new GetByUserIdUseCase(annotationRepository, userRepository);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeGetByUserIdAnnotation
});
