"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/http/controller/user/create-user.spec.ts
var import_supertest = __toESM(require("supertest"));
var import_express = __toESM(require("express"));
var import_vitest = require("vitest");

// src/use-cases/factories/user/create-user.ts
var import_client = require("@prisma/client");

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
      const { name, email, phone, gender, dateBirth, password: password2 } = data;
      const createUser2 = yield this.prisma.user.create({
        data: {
          name,
          email,
          phone,
          gender,
          dateBirth,
          password: password2
        }
      });
      return createUser2;
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
      const { email, password: password2 } = data;
      yield this.prisma.user.update({
        where: {
          email
        },
        data: {
          password: password2
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

// src/use-cases/cases/user/create-user.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_chance = __toESM(require("chance"));

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/user/create-user.ts
var chance = new import_chance.default();
var CreateUser = class {
  constructor(userRepository, emailService, emailRepository) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.emailRepository = emailRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email, password: password2, confirmPassword } = data;
      const userAlreadyExists = yield this.userRepository.getUser({
        email
      });
      if (userAlreadyExists) {
        throw new ErrorHandler(400, "User exists, try again");
      }
      const comparePassword = password2 === confirmPassword;
      if (!comparePassword) {
        throw new ErrorHandler(400, "Password is not equal");
      }
      const newUser = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateBirth: data.dateBirth,
        password: yield import_bcryptjs.default.hash(password2, 8)
      };
      const token = chance.string({ numeric: true, length: 5 });
      yield this.emailService.send(email, token);
      const createdUser = yield this.userRepository.create(newUser);
      const saveEmailToken = {
        email,
        token,
        validated: false,
        attempts: 0
      };
      yield this.emailRepository.create(saveEmailToken);
      return { user: createdUser };
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

// src/repository/prisma/prisma-emailToken-repository.ts
var EmailTokenRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  create(data) {
    return __async(this, null, function* () {
      const { email, token, validated, attempts } = data;
      yield this.prisma.emailToken.create({
        data: {
          email,
          token,
          validated,
          attempts
        }
      });
    });
  }
  checkEmailToken(email) {
    return __async(this, null, function* () {
      const emailToken = this.prisma.emailToken.findFirst({
        where: {
          email
        }
      });
      return emailToken;
    });
  }
  deleteEmailToken(email) {
    return __async(this, null, function* () {
      yield this.prisma.emailToken.delete({
        where: {
          email
        }
      });
    });
  }
  updateAttemptsEmailToken(data) {
    return __async(this, null, function* () {
      yield this.prisma.emailToken.update({
        where: {
          email: data.email
        },
        data: {
          attempts: data.attempts
        }
      });
    });
  }
  updateEmailToken(data) {
    return __async(this, null, function* () {
      const { email, validated } = data;
      yield this.prisma.emailToken.update({
        where: {
          email
        },
        data: {
          validated
        }
      });
    });
  }
};

// src/use-cases/factories/user/create-user.ts
function makeCreateUser() {
  const prisma = new import_client.PrismaClient();
  const userRepository = new UserRepository(prisma);
  const emailService = new SendEmailToken();
  const emailRepository = new EmailTokenRepository(prisma);
  const createUser2 = new CreateUser(
    userRepository,
    emailService,
    emailRepository
  );
  return createUser2;
}

// src/http/controller/user/create-user.ts
var import_zod2 = require("zod");
function createUser(req, res, next) {
  return __async(this, null, function* () {
    try {
      const querySchema = import_zod2.z.object({
        name: import_zod2.z.string(),
        email: import_zod2.z.string().email(),
        phone: import_zod2.z.string(),
        gender: import_zod2.z.string(),
        dateBirth: import_zod2.z.string(),
        password: import_zod2.z.string().min(6),
        confirmPassword: import_zod2.z.string().min(6)
      });
      const data = querySchema.parse(req.body);
      const userusecase = makeCreateUser();
      const createUser2 = yield userusecase.execute(data);
      res.status(200).send(createUser2);
    } catch (error) {
      next(error);
    }
  });
}

// src/http/controller/user/create-user.spec.ts
var import_body_parser = __toESM(require("body-parser"));
var import_chance2 = __toESM(require("chance"));
var chance2 = new import_chance2.default();
var app = (0, import_express.default)();
app.use(import_body_parser.default.json());
app.post("/createUser", createUser);
var password = chance2.string({ numeric: true, length: 6 });
var body = {
  name: chance2.name(),
  email: chance2.email(),
  phone: chance2.phone(),
  gender: chance2.gender(),
  dateBirth: chance2.date(),
  password,
  confirmPassword: password
};
(0, import_vitest.describe)("POST /createUser", () => {
  (0, import_vitest.it)("should create a user successfully with valid data", () => __async(exports, null, function* () {
    const response = yield (0, import_supertest.default)(app).post("/createUser").send(body);
    (0, import_vitest.expect)(response.status).toBe(200);
    (0, import_vitest.expect)(response.body).toEqual({
      user: {
        id: import_vitest.expect.any(String),
        email: body.email,
        name: body.name,
        phone: body.phone,
        gender: body.gender,
        dateBirth: body.dateBirth.toISOString(),
        password: import_vitest.expect.any(String)
      }
    });
  }));
  (0, import_vitest.it)("should return 400, registered user already exists", () => __async(exports, null, function* () {
    yield (0, import_supertest.default)(app).post("/createUser").send(body);
    const response = yield (0, import_supertest.default)(app).post("/createUser").send(body);
    (0, import_vitest.expect)(response.status).toBe(400);
  }));
});
