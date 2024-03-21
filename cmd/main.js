// Define a route

const { hamCallApp } = require("./init");
const login = require("../auth/login");
const register = require("../auth/register");
const verifyToken = require("../auth/jwt");
const reportSpam = require("../internal/reportspam");
const syncContacts = require("../internal/syncContacts");
const search = require("../internal/search");

// Public API calls
hamCallApp.post("/login", login);
hamCallApp.post("/register", register);

// Private API calls
hamCallApp.post("/report-spam", verifyToken, reportSpam);
hamCallApp.post("/sync-contacts", verifyToken, syncContacts);
hamCallApp.get("/search", verifyToken, search);

module.exports = {
  hamCallApp,
};
