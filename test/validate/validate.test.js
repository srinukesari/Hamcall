const {
  validatePhoneNumber,
  validateEmail,
  validatePassword,
} = require("../../validation/validate");

describe("HamCallApp validate function testing ", () => {
  test("valid phonenumber", async () => {
    const response = validatePhoneNumber("9898989898");
    expect(response).toBe(true);
  });

  test("invalid phonenumber", async () => {
    const response = validatePhoneNumber("9ioq989wi");
    expect(response).toBe(false);
  });

  test("valid emailid", async () => {
    const response = validateEmail("lk@gmail.com");
    expect(response).toBe(true);
  });

  test("invalid emailid", async () => {
    const response = validatePhoneNumber("kilq.c");
    expect(response).toBe(false);
  });

  test("strong password", async () => {
    const response = validatePassword("Pqrt@123");
    expect(response).toBe(true);
  });

  test("weak password", async () => {
    const response = validatePassword("ham");
    expect(response).toBe(false);
  });
});
