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

// src/use-cases/cases/task/create.ts
var create_exports = {};
__export(create_exports, {
  CreateTaskUseCase: () => CreateTaskUseCase
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

// src/use-cases/cases/task/create.ts
var CreateTaskUseCase = class {
  constructor(notificationRepository, notificationService, taskRepository, projectRepository, userRepository) {
    this.notificationRepository = notificationRepository;
    this.notificationService = notificationService;
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
  }
  execute(data) {
    return __async(this, null, function* () {
      const projectExists = yield this.projectRepository.findProjectById(
        data.projectId
      );
      if (!projectExists) {
        throw new ErrorHandler(400, "Project does not exist");
      }
      if (data.responsibleId) {
        const responsibleExists = yield this.userRepository.getUserById(
          data.responsibleId
        );
        if (!responsibleExists) {
          throw new ErrorHandler(400, "Responsible not found, try again");
        }
        const isInProject = yield this.projectRepository.isUserInProject(
          data.projectId,
          data.responsibleId
        );
        if (!isInProject) {
          throw new ErrorHandler(400, "Responsible user is not in the project");
        }
      }
      const notificationParams = {
        userId: data.responsibleId,
        senderId: projectExists.ownerId,
        message: `Voc\xEA foi adicionado a tarefa ${data.title}`
      };
      const notification = yield this.notificationRepository.create(notificationParams);
      yield this.notificationService.send(notification);
      const newTask = yield this.taskRepository.create(data);
      return newTask;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateTaskUseCase
});
