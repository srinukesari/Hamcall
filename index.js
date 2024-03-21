const { main } = require("./cmd/main");
const { hamCallApp } = require("./cmd/init");

require("dotenv").config();

//Initialize server routes and database sync up
main();

// Start the server
const PORT = process.env.PORT || 3000;
hamCallApp.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
