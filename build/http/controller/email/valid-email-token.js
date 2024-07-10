"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/http/controller/email/valid-email-token.ts
var valid_email_token_exports = {};
__export(valid_email_token_exports, {
  ValidEmailToken: () => ValidEmailToken2
});
module.exports = __toCommonJS(valid_email_token_exports);

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

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/email/valid-email-token.ts
var import_moment = __toESM(require("moment"));
var ValidEmailToken = class {
  constructor(emailTokenRepository, userRepository) {
    this.emailTokenRepository = emailTokenRepository;
    this.userRepository = userRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email, token } = data;
      const emailAlreadyExists = yield this.userRepository.getUser({ email });
      if (!emailAlreadyExists) {
        throw new ErrorHandler(400, "Email not exists, try again");
      }
      const validEmailToken = yield this.emailTokenRepository.checkEmailToken(email);
      if (!validEmailToken) {
        throw new ErrorHandler(400, "Token not exists, try again");
      }
      const tokenDateFormat = (0, import_moment.default)(validEmailToken.createdAt);
      const currentTime = (0, import_moment.default)().utc();
      const hoursDiff = Math.abs(currentTime.diff(tokenDateFormat, "hours"));
      if (hoursDiff >= 24) {
        yield this.emailTokenRepository.deleteEmailToken(email);
        throw new ErrorHandler(400, "Token has expired, create again");
      }
      if (validEmailToken.attempts === 3) {
        yield this.emailTokenRepository.deleteEmailToken(email);
        throw new ErrorHandler(
          400,
          "Number of attempts exceeded, please create a new token"
        );
      }
      const compareToken = token === validEmailToken.token;
      if (!compareToken) {
        yield this.emailTokenRepository.updateAttemptsEmailToken({
          email,
          attempts: validEmailToken.attempts + 1
        });
        throw new ErrorHandler(400, "The Token sent is invalid, try again");
      }
      yield this.emailTokenRepository.updateEmailToken({
        email,
        validated: true
      });
    });
  }
};

// src/use-cases/factories/email/valid-email-token.ts
var import_client = require("@prisma/client");
function makeValidEmailToken() {
  const prisma = new import_client.PrismaClient();
  const userRepository = new UserRepository(prisma);
  const emailTokenRepository = new EmailTokenRepository(prisma);
  return new ValidEmailToken(emailTokenRepository, userRepository);
}

// src/http/controller/email/valid-email-token.ts
var import_zod2 = require("zod");
function ValidEmailToken2(req, res, next) {
  return __async(this, null, function* () {
    try {
      const bodySchema = import_zod2.z.object({
        email: import_zod2.z.string().email(),
        token: import_zod2.z.string().max(5)
      });
      const data = bodySchema.parse(req.body);
      const emailUseCase = makeValidEmailToken();
      yield emailUseCase.execute(data);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ValidEmailToken
});
