const {
  RegisteredHamUsers,
  GlobalHamUsers,
  ContactBook,
} = require("../models/dbmodels");
const { bcrypt } = require("../cmd/init");
const {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
} = require("../validation/validate");

async function register(req, res) {
  const { username, phonenumber, email, password } = req.body;

  if (email && !validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email-id" });
  }

  if (!username || !phonenumber || !password) {
    return res
      .status(400)
      .json({ message: "phonenumber/password/username can't be empty" });
  }

  if (!validatePhoneNumber(phonenumber)) {
    return res.status(400).json({ message: "Invalid phonenumber" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "password is weak, make sure your password contains atleast one Uppercase, one Lowercase, one Number and one specail char",
    });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database if not exists
    const [user, created] = await RegisteredHamUsers.findOrCreate({
      where: { phonenumber },
      defaults: { username, password: hashPassword, email },
    });

    await GlobalHamUsers.findOrCreate({
      where: { phonenumber },
    });

    await ContactBook.findOrCreate({
      where: { phonenumber },
      defaults: {
        phonenumber,
        name: username,
        contactbookowner: phonenumber,
      },
    });

    if (created) {
      res
        .status(200)
        .json({ message: "User registered successfully", user: user });
    } else {
      res.status(401).json({ message: "User already exits" });
    }
  } catch (error) {
    // Handle registration errors
    res
      .status(400)
      .json({ message: "Registration failed", error: error.message });
  }
}

module.exports = register;
