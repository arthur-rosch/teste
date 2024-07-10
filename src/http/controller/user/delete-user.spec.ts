import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { deleteUser } from "./delete-user";
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
app.delete("/deleteUser", authenticateUser, deleteUser);

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

describe("DELETE /deleteUser", () => {
  it("should return 204, user successfully deleted", async () => {
    await request(app).post("/createUser").send(body);

    const respLogin = await request(app).post("/loginUser").send({
      email: body.email,
      password: body.password,
    });

    const { token } = respLogin.body;

    const respDelete = await request(app)
      .delete("/deleteUser")
      .set("Authorization", `Bearear ${token}`)
      .send({
        email: body.email,
      });

    expect(respDelete.status).toBe(204);
  });

  it("should return 400, user invalid", async () => {
    await request(app).post("/createUser").send(body);

    const respLogin = await request(app).post("/loginUser").send({
      email: body.email,
      password: body.password,
    });

    const { token } = respLogin.body;

    const respDelete = await request(app)
      .delete("/deleteUser")
      .set("Authorization", `Bearear ${token}`)
      .send({
        email: chance.email(),
      });

    expect(respDelete.status).toBe(400);
  });

  it("should return 403, not authenticated", async () => {
    const respDelete = await request(app).delete("/deleteUser").send({
      email: chance.email(),
    });

    expect(respDelete.status).toBe(403);
  });
});
