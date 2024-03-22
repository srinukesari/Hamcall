const request = require("supertest");
const sinon = require("sinon");
const { hamCallApp } = require("../../cmd/main");

const {
  RegisteredHamUsers,
  GlobalHamUsers,
  ContactBook,
} = require("../../models/dbmodels");

describe("HamCallApp ReportSpam API /report-spam", () => {
  const findOneStubReportSpam = sinon.stub(GlobalHamUsers, "findOne");
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

  test("spamnumber can't be empty", async () => {
    const response = await request(hamCallApp)
      .post("/report-spam")
      .send({ spamnumber: "" });

    expect(response.status).toBe(400);
  });

  test("should updated spammer successfully", async () => {
    findOneStubReportSpam.resolves(mockRecord);
    const response = await request(hamCallApp).post("/report-spam").send({
      spamnumber: "9898989898",
    });

    expect(findOneStubReportSpam.calledOnce).toBe(true);
    expect(mockGlobalHamUsersRecord.calledOnce).toBe(true);

    expect(response.status).toBe(200);
    findOneStubReportSpam.restore();
  });

  test("should added spammer successfully", async () => {
    findOneStubReportSpam.resolves({});

    const response = await request(hamCallApp)
      .post("/report-spam")
      .send({ spamnumber: "9393939393" });

    expect(findOneStubReportSpam.calledOnce).toBe(true);
    expect(createStubReportSpam.calledOnce).toBe(true);
    expect(createStubforCB.calledOnce).toBe(true);

    expect(response.status).toBe(200);
    findOneStubReportSpam.restore();
  });
});
