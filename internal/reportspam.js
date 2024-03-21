const { GlobalHamUsers, ContactBook } = require("../models/dbmodels");
const { Op } = require("../cmd/init");
async function reportSpam(req, res) {
  console.log("enters comes here1111------");
  const { spamnumber, spammername } = req.body;

  console.log("enters comes here------");
  if (!spamnumber) {
    return res.status(400).json({ message: "spam number can't be empty" });
  }

  console.log("comes here------");
  const record = await GlobalHamUsers.findOne({
    where: {
      phonenumber: spamnumber,
    },
  });

  console.log("check here", record);

  if (record) {
    record.is_spam = true;
    await record.save();
    res.status(200).json({ message: "Spammer Updated successfully" });
  } else {
    await GlobalHamUsers.create({
      phonenumber: spamnumber,
      is_spam: true,
    });
    await ContactBook.create({
      contactbookowner: "33333",
      phonenumber: spamnumber,
      name: spammername ? spammername : "",
    });
    res.status(200).json({ message: "Spammer Added successfully" });
  }
}

module.exports = reportSpam;
