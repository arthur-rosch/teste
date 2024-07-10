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

// src/use-cases/cases/email/send-email-token.spec.ts
var import_chance2 = __toESM(require("chance"));

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

// src/use-cases/cases/email/send-email-token.spec.ts
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

// src/use-cases/cases/email/send-email-token.ts
var import_chance = __toESM(require("chance"));
var chance = new import_chance.default();
var SendEmailTokenUseCase = class {
  constructor(userRepository2, sendEmailTokeService, emailTokenRepository) {
    this.userRepository = userRepository2;
    this.sendEmailTokeService = sendEmailTokeService;
    this.emailTokenRepository = emailTokenRepository;
  }
  execute(email) {
    return __async(this, null, function* () {
      const userAlreadyExists = yield this.userRepository.getUser({ email });
      if (!userAlreadyExists) {
        throw new ErrorHandler(400, "User not exists, try again");
      }
      const validEmailToken = yield this.emailTokenRepository.checkEmailToken(email);
      if (validEmailToken) {
        yield this.emailTokenRepository.deleteEmailToken(email);
      }
      const token = chance.string({ numeric: true, length: 5 });
      yield this.sendEmailTokeService.send(email, token);
      const saveEmailToken = {
        email,
        token,
        validated: false,
        attempts: 0
      };
      yield this.emailTokenRepository.create(saveEmailToken);
    });
  }
};

// src/service/sendEmail.ts
var import_nodemailer = __toESM(require("nodemailer"));
var SendEmailToken = class {
  send(email, token) {
    return __async(this, null, function* () {
      const transporter = import_nodemailer.default.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: parseInt(process.env.NODEMAILER_HOST),
        secure: true,
        auth: {
          user: process.env.NODEMAILER_AUTH_USER,
          pass: process.env.NODEMAILER_AUTH_PASS
        }
      });
      yield transporter.sendMail({
        from: process.env.NODEMAILER_AUTH_USER,
        to: email,
        subject: "Verifica\xE7\xE3o de posse de e-mail",
        text: `Esse \xE9 seu token de valida\xE7\xE3o: ${token}`,
        html: `<p>Esse \xE9 seu token de valida\xE7\xE3o: ${token}</p>`
      }).then(() => console.log("E-mail enviado com sucesso")).catch((error) => {
        if (error) {
          new ErrorHandler(400, "Email sending failed, please try again");
        }
      });
    });
  }
};

// src/use-cases/cases/email/send-email-token.spec.ts
var chance2 = new import_chance2.default();
var emailService;
var emailRepository;
var userRepository;
var sut;
(0, import_vitest.beforeEach)(() => {
  userRepository = new InMemoryUserRepository();
  emailRepository = new InMemoryEmailTokenRepository();
  emailService = new SendEmailToken();
  sut = new SendEmailTokenUseCase(userRepository, emailService, emailRepository);
});
var user = {
  id: chance2.guid({ version: 4 }),
  name: chance2.name(),
  email: chance2.email(),
  phone: chance2.phone(),
  gender: chance2.gender(),
  dateBirth: chance2.date().toISOString(),
  password: chance2.guid({ version: 4 })
};
(0, import_vitest.describe)("Send Email Token Use Case Test", () => {
  (0, import_vitest.it)("should send the token to the email successfully", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValue(user);
    import_vitest.vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue(null);
    import_vitest.vi.spyOn(emailService, "send");
    import_vitest.vi.spyOn(emailRepository, "create");
    yield sut.execute(user.email);
    (0, import_vitest.expect)(userRepository.getUser).toHaveBeenCalledWith({ email: user.email });
    (0, import_vitest.expect)(emailRepository.checkEmailToken).toHaveBeenCalledWith(user.email);
    (0, import_vitest.expect)(emailService.send).toHaveBeenCalledWith(
      user.email,
      import_vitest.expect.any(String)
    );
    (0, import_vitest.expect)(emailRepository.create).toHaveBeenCalledWith({
      email: user.email,
      token: import_vitest.expect.any(String),
      validated: false,
      attempts: 0
    });
  }));
  (0, import_vitest.it)("should return error, user not exist", () => __async(exports, null, function* () {
    import_vitest.vi.spyOn(userRepository, "getUser").mockResolvedValue(null);
    yield (0, import_vitest.expect)(sut.execute(user.email)).rejects.toThrow(
      new ErrorHandler(400, "User not exists, try again")
    );
  }));
});
