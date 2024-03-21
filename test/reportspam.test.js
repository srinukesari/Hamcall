// tests/login.test.js

const request = require("supertest");
const sinon = require("sinon");
const { hamCallApp } = require("../cmd/main"); // Assuming your Express app is exported from app.js

const { GlobalHamUsers, ContactBook } = require("../models/dbmodels");

describe("HamCallApp ReportSpam API /reportSpam", () => {
  const findOneStubGlobal = sinon.stub(GlobalHamUsers, "findOne");
  const createOneStubGlobal = sinon.stub(GlobalHamUsers, "create");
  const createOneStubContact = sinon.stub(ContactBook, "create");

  test("Spammer updated Successfully", async () => {
    findOneStubGlobal.resolves({
      phonenumber: "9898989898",
      is_spam: false,
    });
    const response = await request(hamCallApp)
      .post("/report-spam")
      .send({ spamnumber: "9898989898" });

    expect(response.status).toBe(200);

    findOneStubGlobal.restore();
  });

  test("Spammer Added Successfully", async () => {
    findOneStubGlobal.resolves({});
    createOneStubGlobal.resolves({
      phonenumber: "9898989898",
      is_spam: true,
    });
    createOneStubContact.resolves({
      contactbookowner: "33333",
      phonenumber: "9898989898",
    });
    const response = await request(hamCallApp)
      .post("/report-spam")
      .send({ spamnumber: "9898989898" });

    expect(response.status).toBe(200);

    findOneStubGlobal.restore();
  });

  test("spam number can't empty", async () => {
    const response = await request(hamCallApp).post("/report-spam").send({});
    expect(response.status).toBe(401);
  });
});
