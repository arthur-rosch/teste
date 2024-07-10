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

// src/use-cases/factories/user/delete-user.ts
var delete_user_exports = {};
__export(delete_user_exports, {
  makeDeleteUser: () => makeDeleteUser
});
module.exports = __toCommonJS(delete_user_exports);
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

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/user/delete-user.ts
var DeleteUser = class {
  constructor(userRepository, emailRepository) {
    this.userRepository = userRepository;
    this.emailRepository = emailRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const { email } = data;
      const userAlreadyExists = yield this.userRepository.getUser({ email });
      const emailTokelAlreadyExist = yield this.emailRepository.checkEmailToken(email);
      if (emailTokelAlreadyExist) {
        yield this.emailRepository.deleteEmailToken(email);
      }
      if (!userAlreadyExists) {
        throw new ErrorHandler(400, "User not exists, try again");
      }
      yield this.userRepository.deleteUser({ email });
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

// src/use-cases/factories/user/delete-user.ts
function makeDeleteUser() {
  const prisma = new import_client.PrismaClient();
  const emailRepository = new EmailTokenRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const deleteUser = new DeleteUser(userRepository, emailRepository);
  return deleteUser;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeDeleteUser
});
