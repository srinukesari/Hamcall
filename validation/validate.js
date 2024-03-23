const { Pattern } = require("../contants");

function validatePhoneNumber(phonenumber) {
  if (Pattern.PhoneNumber.test(phonenumber)) {
    return true;
  }
  return false;
}

function validateEmail(email) {
  if (Pattern.Email.test(email)) {
    return true;
  }
  return false;
}

function validatePassword(password) {
  if (
    !Pattern.hasUppercase.test(password) ||
    !Pattern.hasLowercase.test(password) ||
    !Pattern.hasNumber.test(password) ||
    !Pattern.hasSpecialChar.test(password)
  ) {
    return false;
  }
  return true;
}

module.exports = { validatePhoneNumber, validateEmail, validatePassword };
