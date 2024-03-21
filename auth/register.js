const {
  RegisteredHamUsers,
  GlobalHamUsers,
  ContactBook,
} = require("../models/dbmodels");
const { bcrypt } = require("../cmd/init");

async function register(req, res) {
  const { username, phonenumber, email, password } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
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
    // Handle registration errors (e.g., phonenumber already exists)
    res
      .status(400)
      .json({ message: "Registration failed", error: error.message });
  }
}

module.exports = register;
