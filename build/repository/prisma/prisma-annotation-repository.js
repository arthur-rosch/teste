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

// src/repository/prisma/prisma-annotation-repository.ts
var prisma_annotation_repository_exports = {};
__export(prisma_annotation_repository_exports, {
  AnnotationRepository: () => AnnotationRepository
});
module.exports = __toCommonJS(prisma_annotation_repository_exports);
var AnnotationRepository = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  delete(annotationId) {
    return __async(this, null, function* () {
      const annotationDeleted = yield this.prisma.annotation.delete({
        where: {
          id: annotationId
        }
      });
      return annotationDeleted;
    });
  }
  getByUserId(userId) {
    return __async(this, null, function* () {
      return yield this.prisma.annotation.findMany({
        where: {
          userId
        }
      });
    });
  }
  getById(id) {
    return __async(this, null, function* () {
      return yield this.prisma.annotation.findUnique({
        where: {
          id
        }
      });
    });
  }
  create(data) {
    return __async(this, null, function* () {
      const annotation = yield this.prisma.annotation.create({
        data
      });
      return annotation;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnnotationRepository
});
