const { GlobalHamUsers, ContactBook } = require("../models/dbmodels");
const { Op } = require("../cmd/init");
async function reportSpam(req, res) {
  const { spamnumber, spammername } = req.body;

  const record = await GlobalHamUsers.findOne({
    where: {
      phonenumber: spamnumber,
    },
  });

  if (record) {
    record.is_spam = true;
    await record.save();
    res.json({ message: "Spammer Updated successfully" });
  } else {
    await GlobalHamUsers.create({
      phonenumber: spamnumber,
      is_spam: true,
    });
    await ContactBook.create({
      contactbookowner: "33333",
      phonenumber: spamnumber,
      name: spammername,
    });
    res.json({ message: "Spammer Added successfully" });
  }
}

module.exports = {
  reportSpam,
};
