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

// src/http/middleware/authenticateUser.ts
var authenticateUser_exports = {};
__export(authenticateUser_exports, {
  authenticateUser: () => authenticateUser
});
module.exports = __toCommonJS(authenticateUser_exports);
var import_jsonwebtoken = require("jsonwebtoken");
function authenticateUser(req, res, next) {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(403).json({ msg: "Token is missing" });
  }
  const [, token] = authToken.split(" ");
  if (!token) {
    return res.status(403).json({ msg: "Token format is invalid" });
  }
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    return res.status(500).json({ msg: "Key is not defined" });
  }
  try {
    (0, import_jsonwebtoken.verify)(token, secretKey);
    return next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is invalid" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticateUser
});
