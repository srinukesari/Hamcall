// Define a route
function main() {
  const { hamCallApp, gorm } = require("./init");
  const { login, register } = require("../auth/authenticate");
  const { verifyToken } = require("../auth/jwt");
  const { reportSpam } = require("../internal/reportspam");
  const { syncContacts } = require("../internal/syncContacts");
  const { search } = require("../internal/search");
  const { RegisteredHamUsers } = require("../models/dbmodels");

  // Public API calls
  hamCallApp.post("/login", login);
  hamCallApp.post("/register", register);

  // Private API calls
  hamCallApp.post("/report-spam", verifyToken, reportSpam);
  hamCallApp.post("/sync-contacts", verifyToken, syncContacts);
  hamCallApp.get("/search", verifyToken, search);

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
}

module.exports = {
  main,
};
