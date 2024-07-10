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

// src/repository/in-memory/in-memory-task-repository.ts
var in_memory_task_repository_exports = {};
__export(in_memory_task_repository_exports, {
  InMemoryTaskRepository: () => InMemoryTaskRepository
});
module.exports = __toCommonJS(in_memory_task_repository_exports);
var InMemoryTaskRepository = class {
  constructor() {
    this.tasks = [];
  }
  findById(taskId) {
    return __async(this, null, function* () {
      const task = this.tasks.find((task2) => task2.id === taskId);
      return task || null;
    });
  }
  delete(taskId) {
    return __async(this, null, function* () {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
    });
  }
  create(data) {
    return __async(this, null, function* () {
      const newTask = {
        id: "1",
        title: data.title,
        information: data.information || "",
        status: data.status || "To_Do",
        projectId: data.projectId,
        responsibleId: data.responsibleId,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        files: ""
      };
      this.tasks.push(newTask);
      return newTask;
    });
  }
  updateStatus(taskId, status) {
    return __async(this, null, function* () {
      const task = this.tasks.find((task2) => task2.id === taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      task.status = status;
      task.updatedAt = /* @__PURE__ */ new Date();
      return task;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryTaskRepository
});
