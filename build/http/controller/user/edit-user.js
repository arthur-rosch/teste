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

// src/http/controller/user/edit-user.ts
var edit_user_exports = {};
__export(edit_user_exports, {
  editUser: () => editUser
});
module.exports = __toCommonJS(edit_user_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  editUser
});
