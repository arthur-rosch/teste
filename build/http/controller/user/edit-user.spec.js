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

// src/http/controller/user/edit-user.spec.ts
var import_supertest = __toESM(require("supertest"));
var import_express = __toESM(require("express"));
var import_vitest = require("vitest");

// src/use-cases/factories/user/edit-user.ts
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

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/user/edit-user.ts
var EditUser = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email } = data;
      const userAlreadyExists = yield this.userRepository.getUser({
        email
      });
      if (!userAlreadyExists) {
        throw new ErrorHandler(400, "User not exists, try again");
      }
      const updateUser = {
        name: data.name || userAlreadyExists.name,
        email,
        phone: data.phone || userAlreadyExists.phone,
        gender: data.gender || userAlreadyExists.gender,
        dateBirth: data.dateBirth || userAlreadyExists.dateBirth
      };
      yield this.userRepository.editUser(updateUser);
      return updateUser;
    });
  }
};

// src/use-cases/factories/user/edit-user.ts
function makeEditUser() {
  const prisma = new import_client.PrismaClient();
  const userRepository = new UserRepository(prisma);
  const editUser2 = new EditUser(userRepository);
  return editUser2;
}

// src/http/controller/user/edit-user.ts
var import_zod2 = require("zod");
function editUser(req, res, next) {
  return __async(this, null, function* () {
    try {
      const querySchema = import_zod2.z.object({
        name: import_zod2.z.string().optional(),
        email: import_zod2.z.string().email(),
        phone: import_zod2.z.string().optional(),
        gender: import_zod2.z.string().optional(),
        dateBirth: import_zod2.z.string().optional()
      });
      const data = querySchema.parse(req.body);
      const userusecase = makeEditUser();
      const newUser = yield userusecase.execute(data);
      res.status(200).send(newUser);
    } catch (error) {
      next(error);
    }
  });
}

// src/http/controller/user/edit-user.spec.ts
var import_body_parser = __toESM(require("body-parser"));

// src/use-cases/factories/user/create-user.ts
var import_client2 = require("@prisma/client");

// src/use-cases/cases/user/create-user.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_chance = __toESM(require("chance"));
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
  const prisma = new import_client2.PrismaClient();
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
var import_zod3 = require("zod");
function createUser(req, res, next) {
  return __async(this, null, function* () {
    try {
      const querySchema = import_zod3.z.object({
        name: import_zod3.z.string(),
        email: import_zod3.z.string().email(),
        phone: import_zod3.z.string(),
        gender: import_zod3.z.string(),
        dateBirth: import_zod3.z.string(),
        password: import_zod3.z.string().min(6),
        confirmPassword: import_zod3.z.string().min(6)
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

// src/use-cases/factories/user/login-user.ts
var import_client3 = require("@prisma/client");

// src/use-cases/cases/user/login-user.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"));
var import_jsonwebtoken = require("jsonwebtoken");
var LoginUser = class {
  constructor(userRepository, emailRepository) {
    this.userRepository = userRepository;
    this.emailRepository = emailRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email, password: password2 } = data;
      const userAlreadyExists = yield this.userRepository.getUser({ email });
      if (!userAlreadyExists) {
        throw new ErrorHandler(400, "User not exists, try again");
      }
      const tokenAlreadyValid = yield this.emailRepository.checkEmailToken(email);
      if (!(tokenAlreadyValid == null ? void 0 : tokenAlreadyValid.validated)) {
        throw new ErrorHandler(400, "You need to validate your email to log in");
      }
      const passwordMatch = yield import_bcryptjs2.default.compare(
        password2,
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

// src/use-cases/factories/user/login-user.ts
function makeLoginUser() {
  const prisma = new import_client3.PrismaClient();
  const userRepository = new UserRepository(prisma);
  const emailRepository = new EmailTokenRepository(prisma);
  const loginUser2 = new LoginUser(userRepository, emailRepository);
  return loginUser2;
}

// src/http/controller/user/login-user.ts
var import_zod4 = require("zod");
function loginUser(req, res, next) {
  return __async(this, null, function* () {
    try {
      const querySchema = import_zod4.z.object({
        email: import_zod4.z.string().email(),
        password: import_zod4.z.string().min(6)
      });
      const { email, password: password2 } = querySchema.parse(req.body);
      const userusecase = makeLoginUser();
      const auth = yield userusecase.execute({ email, password: password2 });
      res.status(200).send(auth);
    } catch (error) {
      next(error);
    }
  });
}

// src/http/middleware/authenticateUser.ts
var import_jsonwebtoken2 = require("jsonwebtoken");
function authenticateUser(req, res, next) {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(403).json({ msg: "Token is missing" });
  }
  const [, token] = authToken.split(" ");
  if (!token) {
    return res.status(403).json({ msg: "Token format is invalid" });
  }
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    return res.status(500).json({ msg: "Key is not defined" });
  }
  try {
    (0, import_jsonwebtoken2.verify)(token, secretKey);
    return next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is invalid" });
  }
}

// src/http/controller/user/edit-user.spec.ts
var import_chance2 = __toESM(require("chance"));
var chance2 = new import_chance2.default();
var app = (0, import_express.default)();
app.use(import_body_parser.default.json());
app.post("/createUser", createUser);
app.post("/loginUser", loginUser);
app.patch("/editUser", authenticateUser, editUser);
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
(0, import_vitest.describe)("Edit /editUser", () => {
  (0, import_vitest.it)("should return 200, with edit user", () => __async(exports, null, function* () {
    yield (0, import_supertest.default)(app).post("/createUser").send(body);
    const respLogin = yield (0, import_supertest.default)(app).post("/loginUser").send({
      email: body.email,
      password: body.password
    });
    const { token } = respLogin.body;
    const newName = chance2.string();
    const respEdit = yield (0, import_supertest.default)(app).patch("/editUser").set("Authorization", `Bearear ${token}`).send({
      email: body.email,
      name: newName,
      password: body.password
    });
    (0, import_vitest.expect)(respEdit.status).toBe(200);
    (0, import_vitest.expect)(respEdit.body).toEqual({
      name: newName,
      password: import_vitest.expect.any(String)
    });
  }));
  (0, import_vitest.it)("should return 400, user invalid", () => __async(exports, null, function* () {
    yield (0, import_supertest.default)(app).post("/createUser").send(body);
    const respLogin = yield (0, import_supertest.default)(app).post("/loginUser").send({
      email: body.email,
      password: body.password
    });
    const { token } = respLogin.body;
    const respEdit = yield (0, import_supertest.default)(app).patch("/editUser").set("Authorization", `Bearear ${token}`).send({
      email: "invalid@email.com",
      name: "Invalid Test",
      password: body.password
    });
    (0, import_vitest.expect)(respEdit.status).toBe(400);
  }));
  (0, import_vitest.it)("should return 403, not authenticated", () => __async(exports, null, function* () {
    const respEdit = yield (0, import_supertest.default)(app).patch("/editUser").send({
      email: "invalid@email.com"
    });
    (0, import_vitest.expect)(respEdit.status).toBe(403);
  }));
});
