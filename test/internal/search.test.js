const request = require("supertest");
const sinon = require("sinon");
const { hamCallApp } = require("../../cmd/main");

const { GlobalHamUsers, ContactBook } = require("../../models/dbmodels");

describe("HamCallApp Search API /search", () => {
  const findAllStubSearch = sinon.stub(ContactBook, "findAll");
  const createStubReportSpam = sinon.stub(GlobalHamUsers, "create").resolves({
    phonenumber: "9393939393",
    is_spam: true,
  });
  const createStubforCB = sinon.stub(ContactBook, "create").resolves({
    contactbookowner: "33333",
    phonenumber: "9393939393",
    name: "",
  });

  const mockGlobalHamUsersRecord = sinon.stub().resolves({
    phonenumber: "9898989898",
    is_spam: true,
  });

  const mockRecord = {
    phonenumber: "9898989898",
    is_spam: false,
    save: mockGlobalHamUsersRecord,
  };

  test("search query can't be empty", async () => {
    const response = await request(hamCallApp)
      .get("/search")
      .query({ name: "", phonenumber: "" });

    expect(response.status).toBe(400);
  });

  test("search query with name", async () => {
    findAllStubSearch.resolves({
      phonenumber: "9898989898",
      name: "srinu",
    });

    const response = await request(hamCallApp)
      .get("/search")
      .query({ name: "srinu", phonenumber: "" });

    expect(response.status).toBe(200);
  });

  test("search query with phonenumber", async () => {
    findAllStubSearch.resolves({
      phonenumber: "9898989898",
      name: "srinu",
    });

    const response = await request(hamCallApp)
      .get("/search")
      .query({ name: "srinu", phonenumber: "" });

    expect(response.status).toBe(200);
  });
});
