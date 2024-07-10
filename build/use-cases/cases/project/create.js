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

// src/use-cases/cases/project/create.ts
var create_exports = {};
__export(create_exports, {
  CreateProjectUseCase: () => CreateProjectUseCase
});
module.exports = __toCommonJS(create_exports);

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/project/create.ts
var CreateProjectUseCase = class {
  constructor(notificationRepository, notificationService, projectRepository, userRepository) {
    this.notificationRepository = notificationRepository;
    this.notificationService = notificationService;
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(data.ownerId);
      if (!owner) {
        throw new ErrorHandler(400, "User not found, try again");
      }
      for (const element of data.usersIds) {
        const user = yield this.userRepository.getUserById(element);
        if (!user) {
          throw new ErrorHandler(400, "Added user does not exist");
        }
        const notificationParams2 = {
          userId: element,
          senderId: data.ownerId,
          message: `${owner.name} convidou voc\xEA para o projeto ${data.name}`
        };
        const notification2 = yield this.notificationRepository.create(notificationParams2);
        yield this.notificationService.send(notification2);
      }
      const notificationParams = {
        userId: data.ownerId,
        senderId: data.ownerId,
        message: `Voc\xEA acabou de criar o projeto ${data.name}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      const newProject = yield this.projectRepository.create(data);
      return newProject;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateProjectUseCase
});
