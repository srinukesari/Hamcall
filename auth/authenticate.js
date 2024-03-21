const {
  RegisteredHamUsers,
  GlobalHamUsers,
  ContactBook,
} = require("../models/dbmodels");
const { bcrypt, jwt } = require("../cmd/init");

async function login(req, res) {
  const { secretKey } = require("./contants");
  const { phonenumber, password } = req.body;

  const user = await RegisteredHamUsers.findOne({
    where: {
      phonenumber: phonenumber,
    },
  });

  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Generate JWT token
      const jwtToken = jwt.sign({ userId: phonenumber }, secretKey, {
        expiresIn: "1h",
      }); // Token expires in 1 hour

      // Return token to the client
      res.json({ jwtToken });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } else {
    return res.status(401).json({ message: "Invalid PhoneNumber" });
  }
}

async function register(req, res) {
  const { username, phonenumber, email, password } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    await RegisteredHamUsers.findOrCreate({
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

    console.log("new user create ->>>>>");

    res.json({ message: "User registered successfully" });
  } catch (error) {
    // Handle registration errors (e.g., phonenumber already exists)
    res
      .status(400)
      .json({ message: "Registration failed", error: error.message });
  }
}

module.exports = {
  login,
  register,
};
