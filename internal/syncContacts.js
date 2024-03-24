const { GlobalHamUsers, ContactBook } = require("../models/dbmodels");

// External api just to update db with some contacts if needed
async function syncContacts(req, res) {
  var { contacts } = req.body;
  const contactOwner = { contactbookowner: req.userId };

  contacts = contacts.map((obj) => ({ ...obj, ...contactOwner }));

  try {
    const user = await GlobalHamUsers.bulkCreate(contacts);
    const sync = await ContactBook.bulkCreate(contacts);

    res.json({ message: "contact synced sucessfully", user, sync });
  } catch (error) {
    res
      .status(400)
      .json({ message: "contacts sync failed", error: error.message });
  }
}

module.exports = syncContacts;
