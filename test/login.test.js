// tests/login.test.js

const request = require("supertest");
const sinon = require("sinon");
const { hamCallApp } = require("../cmd/main"); // Assuming your Express app is exported from app.js

const { RegisteredHamUsers } = require("../models/dbmodels");

describe("HamCallApp Login API /login", () => {
  const findOneStubLogin = sinon.stub(RegisteredHamUsers, "findOne");
  findOneStubLogin.resolves({
    phonenumber: "9898989898",
    password: "$2b$10$CuIypBeg2BKkcAZo.yHWc.rFrIekJ70AKw8sk63sG2l6YFbZnpzyK",
  });

  test("should return a token when valid credentials are provided", async () => {
    const response = await request(hamCallApp)
      .post("/login")
      .send({ phonenumber: "9898989898", password: "pass" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("jwtToken");
  });

  test("should return an error when invalid credentials are provided", async () => {
    const response = await request(hamCallApp).post("/login").send({
      phonenumber: "9898989898",
      password: "notMatchingPasswordwithHash",
    });

    expect(response.status).toBe(401);
  });

  test("should return an error when empty credentials are provided", async () => {
    const response = await request(hamCallApp).post("/login").send({});
    expect(response.status).toBe(401);
  });
});
