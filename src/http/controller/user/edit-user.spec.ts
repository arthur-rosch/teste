import request from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";
import { editUser } from "./edit-user";
import bodyParser from "body-parser";
import { createUser } from "./create-user";
import { loginUser } from "./login-user";
import { authenticateUser } from "@/http/middleware/authenticateUser";
import Chance from "chance";

const chance = new Chance();

const app = express();
app.use(bodyParser.json());

app.post("/createUser", createUser);
app.post("/loginUser", loginUser);
app.patch("/editUser", authenticateUser, editUser);

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

describe("Edit /editUser", () => {
  it("should return 200, with edit user", async () => {
    await request(app).post("/createUser").send(body);

    const respLogin = await request(app).post("/loginUser").send({
      email: body.email,
      password: body.password,
    });

    const { token } = respLogin.body;

    const newName = chance.string();

    const respEdit = await request(app)
      .patch("/editUser")
      .set("Authorization", `Bearear ${token}`)
      .send({
        email: body.email,
        name: newName,
        password: body.password,
      });

    expect(respEdit.status).toBe(200);
    expect(respEdit.body).toEqual({
      name: newName,
      password: expect.any(String),
    });
  });

  it("should return 400, user invalid", async () => {
    await request(app).post("/createUser").send(body);

    const respLogin = await request(app).post("/loginUser").send({
      email: body.email,
      password: body.password,
    });

    const { token } = respLogin.body;

    const respEdit = await request(app)
      .patch("/editUser")
      .set("Authorization", `Bearear ${token}`)
      .send({
        email: "invalid@email.com",
        name: "Invalid Test",
        password: body.password,
      });

    expect(respEdit.status).toBe(400);
  });

  it("should return 403, not authenticated", async () => {
    const respEdit = await request(app).patch("/editUser").send({
      email: "invalid@email.com",
    });

    expect(respEdit.status).toBe(403);
  });
});
