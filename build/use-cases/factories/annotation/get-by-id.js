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

// src/use-cases/factories/annotation/get-by-id.ts
var get_by_id_exports = {};
__export(get_by_id_exports, {
  makeGetByIdAnnotation: () => makeGetByIdAnnotation
});
module.exports = __toCommonJS(get_by_id_exports);

// src/repository/prisma/prisma-annotation-repository.ts
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

// src/http/middleware/errorResponse.ts
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};

// src/use-cases/cases/annotation/get-by-id.ts
var GetByIdUseCase = class {
  constructor(annotationRepository) {
    this.annotationRepository = annotationRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({ annotationId }) {
      const annotation = yield this.annotationRepository.getById(annotationId);
      if (!annotation) {
        throw new ErrorHandler(400, "Annotation not found, try again");
      }
      return annotation;
    });
  }
};

// src/use-cases/factories/annotation/get-by-id.ts
var import_client = require("@prisma/client");
function makeGetByIdAnnotation() {
  const prisma = new import_client.PrismaClient();
  const annotationRepository = new AnnotationRepository(prisma);
  return new GetByIdUseCase(annotationRepository);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeGetByIdAnnotation
});
