import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { loginUser } from "./login-user";
import bodyParser from "body-parser";
import Chance from "chance";
import { createUser } from "./create-user";

const chance = new Chance();

const app = express();
app.use(bodyParser.json());
app.post("/createUser", createUser);
app.post("/loginUser", loginUser);

const password = chance.string({ numeric: true, length: 6 });

const body = {
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date(),
  password,
  confirmPassword: password,
};

describe("POST /loginUser", () => {
  it("should login a user successfully with valid data", async () => {
    await request(app).post("/createUser").send(body);

    const response = await request(app).post("/loginUser").send({
      email: body.email,
      password: body.password,
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });

  it("should return 400, credentials invalid", async () => {
    await request(app).post("/createUser").send(body);

    const response = await request(app).post("/loginUser").send({
      email: chance.email(),
      password: body.password,
    });
    expect(response.status).toBe(400);
  });
});
