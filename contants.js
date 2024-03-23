const C = {
  PhoneNumber: "phonenumber",
  IsSpam: "is_spam",
  UserName: "username",
  Email: "email",
  Name: "name",
  Id: "id",
};

const Model = {
  RegisteredHamUsers: "registeredhamusers",
  GlobalHamUsers: "globalhamusers",
  ContactBooks: "contactbooks",
};

const Pattern = {
  PhoneNumber: /^\+?\d{1,3}[-\s]?\(?\d{1,4}\)?[-\s]?\d{1,4}[-\s]?\d{1,4}$/,
  Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UserName: /^[a-zA-Z0-9_]+$/,
  hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
};

module.exports = {
  C,
  Model,
  Pattern,
};
