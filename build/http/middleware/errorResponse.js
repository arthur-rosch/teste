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

// src/http/middleware/errorResponse.ts
var errorResponse_exports = {};
__export(errorResponse_exports, {
  ErrorHandler: () => ErrorHandler,
  handleError: () => handleError
});
module.exports = __toCommonJS(errorResponse_exports);
var import_zod = require("zod");
var ErrorHandler = class extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
};
var handleError = (err, req, res, next) => {
  if (err instanceof import_zod.ZodError) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation error",
      errors: err.errors.map((e) => ({
        path: e.path,
        message: e.message
      }))
    });
    return;
  }
  const { statusCode, message } = err;
  res.status(statusCode || 500).json({
    status: "error",
    statusCode,
    message
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorHandler,
  handleError
});
