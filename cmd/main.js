// Define a route
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

(async () => {
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
})();

// Start the server
const PORT = process.env.PORT || 3000;
hamCallApp.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
