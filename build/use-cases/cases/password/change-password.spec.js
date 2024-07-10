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

// src/use-cases/cases/password/change-password.spec.ts
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

// src/use-cases/cases/password/change-password.spec.ts
var import_vitest = require("vitest");

// src/use-cases/cases/password/change-password.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/password/change-password.ts
var ChangePassword = class {
  constructor(userRepository2, emailTokenRepository) {
    this.userRepository = userRepository2;
    this.emailTokenRepository = emailTokenRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email, password, confirmPassword } = data;
      const emailAlreadyExists = yield this.userRepository.getUser({ email });
      if (!emailAlreadyExists) {
        throw new ErrorHandler(400, "Email not exists, try again");
      }
      const validEmailToken = yield this.emailTokenRepository.checkEmailToken(email);
      if (!validEmailToken) {
        throw new ErrorHandler(400, "Token not exists, try again");
      }
      if (validEmailToken.validated !== true) {
        throw new ErrorHandler(
          400,
          "The Token has not yet been validated, please try again"
        );
      }
      const comparePassword = password === confirmPassword;
      if (!comparePassword) {
        throw new ErrorHandler(400, "Password is not equal");
      }
      yield this.userRepository.changePassword({
        email,
        password: yield import_bcryptjs.default.hash(password, 8)
      });
      yield this.emailTokenRepository.deleteEmailToken(email);
    });
  }
};

// src/use-cases/cases/password/change-password.spec.ts
var chance = new import_chance.default();
var emailRepository;
var userRepository;
var sut;
(0, import_vitest.beforeEach)(() => {
  userRepository = new InMemoryUserRepository(), emailRepository = new InMemoryEmailTokenRepository();
  sut = new ChangePassword(userRepository, emailRepository);
});
var createUser = {
  id: chance.guid({ version: 4 }),
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 })
};
(0, import_vitest.describe)("Change Password Use Case Test", () => {
  const password = chance.string();
  const userParams = {
    email: createUser.email,
    password,
    confirmPassword: password
  };
  (0, import_vitest.it)("should change password successfully", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValue(createUser);
    const emailToken = {
      id: chance.string(),
      email: createUser.email,
      token: chance.string({ numeric: true, length: 6 }),
      validated: true,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: chance.date(),
      updatedAt: chance.date()
    };
    import_vitest.vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue(emailToken);
    yield sut.execute(userParams);
    (0, import_vitest.expect)(userRepository.getUser).toHaveBeenCalledWith({
      email: userParams.email
    });
    (0, import_vitest.expect)(emailRepository.checkEmailToken).toBeCalledWith(userParams.email);
  }));
  (0, import_vitest.it)("should return error, user not exist", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValue(null);
    yield (0, import_vitest.expect)(sut.execute(userParams)).rejects.toThrow(
      new ErrorHandler(400, "Email not exists, try again")
    );
  }));
  (0, import_vitest.it)("should return error, token not exist", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValue(createUser);
    import_vitest.vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue(null);
    yield (0, import_vitest.expect)(sut.execute(userParams)).rejects.toThrow(
      new ErrorHandler(400, "Token not exists, try again")
    );
  }));
  (0, import_vitest.it)("should return error, token not validated", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValue(createUser);
    const emailToken = {
      id: chance.string(),
      email: createUser.email,
      token: chance.string({ numeric: true, length: 6 }),
      validated: false,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: chance.date(),
      updatedAt: chance.date()
    };
    import_vitest.vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue(emailToken);
    yield (0, import_vitest.expect)(sut.execute(userParams)).rejects.toThrow(
      new ErrorHandler(
        400,
        "The Token has not yet been validated, please try again"
      )
    );
  }));
  (0, import_vitest.it)("should return error, password is not the same", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValue(createUser);
    const emailToken = {
      id: chance.string(),
      email: createUser.email,
      token: chance.string({ numeric: true, length: 6 }),
      validated: true,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: chance.date(),
      updatedAt: chance.date()
    };
    import_vitest.vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue(emailToken);
    yield (0, import_vitest.expect)(
      sut.execute({
        email: userParams.email,
        password: userParams.password,
        confirmPassword: chance.string()
      })
    ).rejects.toThrow(new ErrorHandler(400, "Password is not equal"));
  }));
});
