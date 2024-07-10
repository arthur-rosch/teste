import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { createUser } from "./create-user";
import bodyParser from "body-parser";
import Chance from "chance";

const chance = new Chance();

const app = express();
app.use(bodyParser.json());
app.post("/createUser", createUser);

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

describe("POST /createUser", () => {
  it("should create a user successfully with valid data", async () => {
    const response = await request(app).post("/createUser").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: {
        id: expect.any(String),
        email: body.email,
        name: body.name,
        phone: body.phone,
        gender: body.gender,
        dateBirth: body.dateBirth.toISOString(),
        password: expect.any(String),
      },
    });
  });

  it("should return 400, registered user already exists", async () => {
    await request(app).post("/createUser").send(body);

    const response = await request(app).post("/createUser").send(body);
    expect(response.status).toBe(400);
  });
});
