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

// src/use-cases/cases/project/update-status-privacy.ts
var update_status_privacy_exports = {};
__export(update_status_privacy_exports, {
  UpdateStatusPrivacyProjectUseCase: () => UpdateStatusPrivacyProjectUseCase
});
module.exports = __toCommonJS(update_status_privacy_exports);

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/project/update-status-privacy.ts
var UpdateStatusPrivacyProjectUseCase = class {
  constructor(projectRepository, userRepository) {
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
  }
  execute(projectId, ownerId, statusPrivacy) {
    return __async(this, null, function* () {
      const owner = yield this.userRepository.getUserById(ownerId);
      if (!owner) {
        throw new ErrorHandler(400, "User not found, try again");
      }
      const projectExists = yield this.projectRepository.findProjectById(projectId);
      if (!projectExists) {
        throw new Error("Project does not exist");
      }
      if (projectExists.ownerId !== ownerId) {
        throw new ErrorHandler(
          400,
          "Unauthorized, Only owner can delete the Project"
        );
      }
      const updatedProject = yield this.projectRepository.updateStatus(
        projectId,
        statusPrivacy
      );
      return updatedProject;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateStatusPrivacyProjectUseCase
});
