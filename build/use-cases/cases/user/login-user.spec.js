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

// src/use-cases/cases/user/login-user.spec.ts
var import_dotenv = __toESM(require("dotenv"));
var import_bcryptjs2 = __toESM(require("bcryptjs"));
var import_chance = __toESM(require("chance"));

// src/use-cases/cases/user/login-user.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsonwebtoken = require("jsonwebtoken");

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/user/login-user.ts
var LoginUser = class {
  constructor(userRepository2, emailRepository2) {
    this.userRepository = userRepository2;
    this.emailRepository = emailRepository2;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email, password } = data;
      const userAlreadyExists = yield this.userRepository.getUser({ email });
      if (!userAlreadyExists) {
        throw new ErrorHandler(400, "User not exists, try again");
      }
      const tokenAlreadyValid = yield this.emailRepository.checkEmailToken(email);
      if (!(tokenAlreadyValid == null ? void 0 : tokenAlreadyValid.validated)) {
        throw new ErrorHandler(400, "You need to validate your email to log in");
      }
      const passwordMatch = yield import_bcryptjs.default.compare(
        password,
        userAlreadyExists.password
      );
      if (!passwordMatch) {
        throw new ErrorHandler(400, "Password is not equal");
      }
      const secrectKey = process.env.JWT_SECRET;
      if (!secrectKey) {
        throw new ErrorHandler(500, "Key is not defined");
      }
      const token = (0, import_jsonwebtoken.sign)({}, secrectKey, {
        subject: email,
        expiresIn: process.env.JWT_EXPIRE
      });
      return { user: userAlreadyExists, token };
    });
  }
};

// src/use-cases/cases/user/login-user.spec.ts
var import_vitest = require("vitest");

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
  editUser(data) {
    return __async(this, null, function* () {
      const userIndex = this.users.findIndex((u) => u.id === data.id);
      this.users[userIndex] = __spreadValues(__spreadValues({}, this.users[userIndex]), data);
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

// src/repository/in-memory/in-memory-emailToken-repository.ts
var InMemoryEmailTokenRepository = class {
  constructor() {
    this.tokens = [];
  }
  create(data) {
    return __async(this, null, function* () {
      this.tokens.push(data);
    });
  }
  checkEmailToken(email) {
    return __async(this, null, function* () {
      const token = this.tokens.find((token2) => token2.email === email);
      return token || null;
    });
  }
  deleteEmailToken(email) {
    return __async(this, null, function* () {
      this.tokens = this.tokens.filter((token) => token.email !== email);
    });
  }
  updateAttemptsEmailToken(data) {
    return __async(this, null, function* () {
      const tokenIndex = this.tokens.findIndex(
        (token) => token.email === data.email
      );
      if (tokenIndex !== -1) {
        this.tokens[tokenIndex].attempts = data.attempts || 0;
      }
    });
  }
  updateEmailToken(data) {
    return __async(this, null, function* () {
      const tokenIndex = this.tokens.findIndex(
        (token) => token.email === data.email
      );
      if (tokenIndex !== -1) {
        this.tokens[tokenIndex].validated = data.validated || false;
      }
    });
  }
};

// src/use-cases/cases/user/login-user.spec.ts
var chance = new import_chance.default();
var userRepository;
var emailRepository;
var sut;
(0, import_vitest.beforeEach)(() => {
  userRepository = new InMemoryUserRepository();
  emailRepository = new InMemoryEmailTokenRepository();
  sut = new LoginUser(userRepository, emailRepository);
  import_dotenv.default.config();
});
var user = {
  id: chance.guid({ version: 4 }),
  name: chance.string(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 })
};
(0, import_vitest.describe)("Login User Test", () => {
  (0, import_vitest.it)("should log in successfully", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValue(user);
    import_vitest.vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token: chance.guid({ version: 4 }),
      validated: true,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    const mockPasswordCompare = import_vitest.vi.fn().mockResolvedValue(true);
    import_vitest.vi.spyOn(import_bcryptjs2.default, "compare").mockImplementation(mockPasswordCompare);
    const token = yield sut.execute({
      email: user.email,
      password: user.password
    });
    (0, import_vitest.expect)(token).toEqual({
      token: import_vitest.expect.any(String),
      user
    });
  }));
  (0, import_vitest.it)("should return an error, user does not exist", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValueOnce(null);
    yield (0, import_vitest.expect)(sut.execute(user)).rejects.toThrow(
      new ErrorHandler(400, "User not exists, try again")
    );
  }));
  (0, import_vitest.it)("should return an error, email not validate ", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValue(user);
    import_vitest.vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token: chance.guid({ version: 4 }),
      validated: false,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    yield (0, import_vitest.expect)(sut.execute(user)).rejects.toThrow(
      new ErrorHandler(400, "You need to validate your email to log in")
    );
  }));
  (0, import_vitest.it)("should return an error, different passwords", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValue(user);
    import_vitest.vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token: chance.guid({ version: 4 }),
      validated: true,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    const mockPasswordCompare = import_vitest.vi.fn().mockResolvedValue(false);
    import_vitest.vi.spyOn(import_bcryptjs2.default, "compare").mockImplementation(mockPasswordCompare);
    yield (0, import_vitest.expect)(sut.execute(user)).rejects.toThrow(
      new ErrorHandler(400, "Password is not equal")
    );
  }));
  (0, import_vitest.it)("should return an error, key jwt is not defined", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValue(user);
    import_vitest.vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token: chance.guid({ version: 4 }),
      validated: true,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    const originalJwtSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    const mockPasswordCompare = import_vitest.vi.fn().mockResolvedValue(true);
    import_vitest.vi.spyOn(import_bcryptjs2.default, "compare").mockImplementation(mockPasswordCompare);
    yield (0, import_vitest.expect)(sut.execute(user)).rejects.toThrow(
      new ErrorHandler(500, "Key is not defined")
    );
    process.env.JWT_SECRET = originalJwtSecret;
  }));
});
