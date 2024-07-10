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

// src/utils/test/mock-user-and-project.ts
var mock_user_and_project_exports = {};
__export(mock_user_and_project_exports, {
  createMockUserAndProject: () => createMockUserAndProject
});
module.exports = __toCommonJS(mock_user_and_project_exports);
var import_chance2 = __toESM(require("chance"));

// src/utils/test/mock-user.ts
var import_chance = __toESM(require("chance"));
var import_bcryptjs = require("bcryptjs");
var chance = new import_chance.default();
function createMockUser(userRepository) {
  return __async(this, null, function* () {
    const name = chance.name();
    const email = chance.email();
    const password = yield (0, import_bcryptjs.hash)(chance.string({ length: 8 }), 6);
    return yield userRepository.create({
      name,
      email,
      password
    });
  });
}

// src/utils/test/mock-user-and-project.ts
var chance2 = new import_chance2.default();
function createMockUserAndProject(userRepository, projectRepository) {
  return __async(this, null, function* () {
    const user = yield createMockUser(userRepository);
    const project = yield projectRepository.create({
      name: chance2.word({ length: 5 }),
      color: chance2.color({ format: "hex" }),
      ownerId: user.id,
      usersIds: [user.id],
      privacy: "Private"
    });
    return { user, project };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createMockUserAndProject
});
