const request = require("supertest");
const sinon = require("sinon");
const { hamCallApp } = require("../cmd/main"); // Assuming your Express app is exported from app.js

const {
  RegisteredHamUsers,
  GlobalHamUsers,
  ContactBook,
} = require("../models/dbmodels");

describe("HamCallApp Register API /register", () => {
  const createStubforRegister = sinon.stub(RegisteredHamUsers, "findOrCreate");
  const globalStubforRegister = sinon.stub(GlobalHamUsers, "findOrCreate");
  globalStubforRegister.resolves({
    phonenumber: "9898989898",
    username: "kesari",
    is_spam: false,
  });

  const contactBookStubforRegister = sinon.stub(ContactBook, "findOrCreate");
  globalStubforRegister.resolves({
    phonenumber: "9898989898",
    username: "kesari",
    is_spam: false,
  });

  test("user registration successfull", async () => {
    createStubforRegister.resolves([
      {
        phonenumber: "9898989898",
        password: "pass",
        username: "kesari",
        email: "kesari@gmail.com",
      },
      true,
    ]);
    const response = await request(hamCallApp).post("/register").send({
      phonenumber: "9898989898",
      password: "pass",
      username: "kesari",
      email: "kesari@gmail.com",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    createStubforRegister.restore();
  });

  test("user already exits", async () => {
    createStubforRegister.resolves([
      {
        phonenumber: "9898989898",
        password: "pass",
        username: "kesari",
        email: "kesari@gmail.com",
      },
      false,
    ]);
    const response = await request(hamCallApp).post("/register").send({
      phonenumber: "9898989898",
      password: "pass",
      username: "kesari",
      email: "kesari@gmail.com",
    });

    expect(response.status).toBe(401);
    createStubforRegister.restore();
  });
});
