const {
  GlobalHamUsers,
  ContactBook,
  RegisteredHamUsers,
} = require("../models/dbmodels");
const { gorm, Op, literal } = require("../cmd/init");

async function search(req, res) {
  const { name, phonenumber } = req.query;

  if (!name && !phonenumber) {
    res.status(400).json({ message: "query can't be empty" });
  }

  if (name) {
    await ContactBook.findAll({
      attributes: ["phonenumber", "name"],
      include: {
        model: GlobalHamUsers,
        attributes: ["is_spam"],
        on: {
          "$contactbooks.phonenumber$": {
            [Op.eq]: gorm.col("globalhamuser.phonenumber"),
          },
        },
      },
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `${name}%` } },
          { name: { [Op.iLike]: `%${name}%` } },
        ],
      },
      order: literal("CASE WHEN name LIKE '" + name + "%' THEN 0 ELSE 1 END"),
    })
      .then((record) => {
        res.json({ searchresult: record });
      })
      .catch((error) => {
        res.status(400).json({ message: "error in search query", error });
      });
  } else {
    const userExitsInSearchPersonContactBook = await ContactBook.findOne({
      where: {
        phonenumber: req.userId,
        contactbookowner: phonenumber,
      },
    });
    const record = await RegisteredHamUsers.findOne({
      attributes: userExitsInSearchPersonContactBook
        ? ["phonenumber", "username", "email"]
        : ["phonenumber", "username"],
      include: {
        model: GlobalHamUsers,
        attributes: ["is_spam"],
        on: {
          "$registeredhamusers.phonenumber$": {
            [Op.eq]: gorm.col("globalhamuser.phonenumber"),
          },
        },
      },
      where: {
        phonenumber: phonenumber,
      },
    });
    if (record) {
      res.json({ searchresult: record });
    } else {
      await ContactBook.findAll({
        attributes: ["phonenumber", "name"],
        include: {
          model: GlobalHamUsers,
          attributes: ["is_spam"],
          on: {
            "$contactbooks.phonenumber$": {
              [Op.eq]: gorm.col("globalhamuser.phonenumber"),
            },
          },
        },
        where: {
          phonenumber: phonenumber,
        },
      })
        .then((record) => {
          res.json({ searchresult: record });
        })
        .catch((error) => {
          res.status(400).json({ message: "error in search query", error });
        });
    }
  }
}

module.exports = {
  search,
};
