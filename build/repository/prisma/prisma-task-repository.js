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

// src/repository/prisma/prisma-task-repository.ts
var prisma_task_repository_exports = {};
__export(prisma_task_repository_exports, {
  TaskRepository: () => TaskRepository
});
module.exports = __toCommonJS(prisma_task_repository_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var TaskRepository = class {
  delete(taskId) {
    return __async(this, null, function* () {
      yield prisma.task.delete({
        where: { id: taskId }
      });
    });
  }
  create(data) {
    return __async(this, null, function* () {
      return yield prisma.task.create({
        data
      });
    });
  }
  updateStatus(taskId, status) {
    return __async(this, null, function* () {
      return yield prisma.task.update({
        where: { id: taskId },
        data: { status }
      });
    });
  }
  findById(taskId) {
    return __async(this, null, function* () {
      const task = yield prisma.task.findUnique({
        where: { id: taskId }
      });
      if (!task) return null;
      return task;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TaskRepository
});
