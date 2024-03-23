const request = require("supertest");
const sinon = require("sinon");
const { hamCallApp } = require("../../cmd/main");

const {
  RegisteredHamUsers,
  GlobalHamUsers,
  ContactBook,
} = require("../../models/dbmodels");

describe("HamCallApp Register API /register", () => {
  const createStubforRegister = sinon.stub(RegisteredHamUsers, "findOrCreate");
  const globalStubforRegister = sinon.stub(GlobalHamUsers, "findOrCreate");
  globalStubforRegister.resolves({
    phonenumber: "9898989898",
    username: "kesari",
    is_spam: false,
  });

  const contactBookStubforRegister = sinon.stub(ContactBook, "findOrCreate");
  contactBookStubforRegister.resolves({
    phonenumber: "9898989898",
    name: "kesari",
    contactbookowner: "9898989898",
  });

  test("user registration successfull", async () => {
    createStubforRegister.resolves([
      {
        phonenumber: "9898989898",
        password: "Pass@123",
        username: "kesari",
        email: "kesari@gmail.com",
      },
      true,
    ]);
    const response = await request(hamCallApp).post("/register").send({
      phonenumber: "9898989898",
      password: "Pass@123",
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
        password: "Pass@123",
        username: "kesari",
        email: "kesari@gmail.com",
      },
      false,
    ]);
    const response = await request(hamCallApp).post("/register").send({
      phonenumber: "9898989898",
      password: "Pass@123",
      username: "kesari",
      email: "kesari@gmail.com",
    });

    expect(response.status).toBe(401);
    createStubforRegister.restore();
  });

  test("invalid creds for registeration", async () => {
    const response = await request(hamCallApp).post("/register").send({
      phonenumber: "",
      password: "pass",
      username: "",
      email: "kesari@gmail.com",
    });

    expect(response.status).toBe(400);
    createStubforRegister.restore();
  });
});
