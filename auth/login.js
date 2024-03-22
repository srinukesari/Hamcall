const { RegisteredHamUsers } = require("../models/dbmodels");
const { bcrypt, jwt } = require("../cmd/init");

async function login(req, res) {
  const { phonenumber, password } = req.body;

  if (!phonenumber || !password) {
    return res
      .status(401)
      .json({ message: "phonenumber and password can't be empty" });
  }

  const user = await RegisteredHamUsers.findOne({
    where: {
      phonenumber: phonenumber,
    },
  });

  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Generate JWT token
      const jwtToken = jwt.sign(
        { userId: phonenumber },
        process.env.SECRET_KEY,
        { expiresIn: "3h" } // Token expires in 3 hour
      );

      // Return token to the client
      res.json({ jwtToken });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } else {
    return res.status(401).json({ message: "Invalid PhoneNumber" });
  }
}

module.exports = login;
