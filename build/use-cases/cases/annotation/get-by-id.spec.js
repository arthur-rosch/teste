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

// src/use-cases/cases/annotation/get-by-id.spec.ts
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

// src/use-cases/cases/annotation/get-by-id.ts
var GetByIdUseCase = class {
  constructor(annotationRepository2) {
    this.annotationRepository = annotationRepository2;
  }
  execute(_0) {
    return __async(this, arguments, function* ({ annotationId }) {
      const annotation = yield this.annotationRepository.getById(annotationId);
      if (!annotation) {
        throw new ErrorHandler(400, "Annotation not found, try again");
      }
      return annotation;
    });
  }
};

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

// src/repository/in-memory/in-memory-annotation-repository.ts
var InMemoryAnnotationRepository = class {
  constructor() {
    this.annotations = [];
  }
  delete(annotationId) {
    return __async(this, null, function* () {
      const annotationIndex = this.annotations.findIndex(
        (annotation) => annotation.id === annotationId
      );
      const [deletedAnnotation] = this.annotations.splice(annotationIndex, 1);
      return deletedAnnotation;
    });
  }
  getByUserId(userId) {
    return __async(this, null, function* () {
      return this.annotations.filter((annotation) => annotation.userId === userId);
    });
  }
  getById(annotationId) {
    return __async(this, null, function* () {
      return this.annotations.find((annotation) => annotation.id === annotationId) || null;
    });
  }
  create(data) {
    return __async(this, null, function* () {
      const annotation = __spreadValues({
        id: (this.annotations.length + 1).toString()
      }, data);
      this.annotations.push(annotation);
      return annotation;
    });
  }
};

// src/utils/test/mock-user.ts
var import_chance = __toESM(require("chance"));
var import_bcryptjs = require("bcryptjs");
var chance = new import_chance.default();
function createMockUser(userRepository2) {
  return __async(this, null, function* () {
    const name = chance.name();
    const email = chance.email();
    const password = yield (0, import_bcryptjs.hash)(chance.string({ length: 8 }), 6);
    return yield userRepository2.create({
      name,
      email,
      password
    });
  });
}

// src/lib/change.ts
var import_chance2 = __toESM(require("chance"));
var chance2 = new import_chance2.default();

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/utils/test/mock-user-and-project.ts
var import_chance3 = __toESM(require("chance"));
var chance3 = new import_chance3.default();

// src/use-cases/cases/annotation/get-by-id.spec.ts
var annotationRepository;
var userRepository;
var sut;
(0, import_vitest.describe)("Get Annotation By Id Use Case", () => {
  (0, import_vitest.beforeEach)(() => {
    annotationRepository = new InMemoryAnnotationRepository();
    userRepository = new InMemoryUserRepository();
    sut = new GetByIdUseCase(annotationRepository);
  });
  (0, import_vitest.it)("should be able to get an annotation by id", () => __async(exports, null, function* () {
    const { id } = yield createMockUser(userRepository);
    const createdAnnotation = yield annotationRepository.create({
      id: "1",
      color: "blue",
      information: "This is a test annotation",
      title: "Test Annotation",
      userId: id
    });
    const annotation = yield sut.execute({ annotationId: createdAnnotation.id });
    (0, import_vitest.expect)(annotation).toEqual(createdAnnotation);
  }));
  (0, import_vitest.it)("should throw an error if annotation not found", () => __async(exports, null, function* () {
    yield (0, import_vitest.expect)(
      sut.execute({ annotationId: "non-existent-annotation" })
    ).rejects.toBeInstanceOf(ErrorHandler);
  }));
});
