const { hamCallApp } = require("./cmd/main");
const { gorm } = require("./cmd/init");
const { RegisteredHamUsers } = require("./models/dbmodels");

require("dotenv").config();

//Test database connection and create adminuser for hamcall
gorm
  .authenticate()
  .then(async () => {
    console.error("Database connection established successfully!!!");

    await gorm.sync();

    const adminExists = await RegisteredHamUsers.findOne({
      phonenumber: "33333",
    });
    if (!adminExists) {
      RegisteredHamUsers.create({
        username: "hamadmin",
        password: "hamadminpass",
        phonenumber: "33333",
      });
    }
    console.log("Database synced");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Start the server
const PORT = process.env.PORT || 3000;
hamCallApp.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
