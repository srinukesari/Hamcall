const {
  GlobalHamUsers,
  ContactBook,
  RegisteredHamUsers,
} = require("../models/dbmodels");
const { gorm, Op, literal } = require("../cmd/init");
const { C, Model } = require("../contants");

async function search(req, res) {
  const { name, phonenumber } = req.query;

  if (!name && !phonenumber) {
    return res.status(400).json({ message: "query can't be empty" });
  }

  if (name) {
    searchByName(res, name);
  } else if (phonenumber) {
    searchByPhoneNumber(req, res, phonenumber);
  }
}

async function searchByName(res, name) {
  await ContactBook.findAll({
    attributes: [C.PhoneNumber, C.Name],
    include: {
      model: GlobalHamUsers,
      attributes: [C.IsSpam],
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
      return res.status(200).json({ searchresult: record });
    })
    .catch((error) => {
      return res.status(400).json({ message: "error in search query", error });
    });
}

async function searchByPhoneNumber(req, res, phonenumber) {
  console.log("check here,,", phonenumber, req.userId);
  const userExitsInSearchPersonContactBook = await ContactBook.findOne({
    where: {
      phonenumber: req.userId,
      contactbookowner: phonenumber,
    },
  });
  const record = await RegisteredHamUsers.findOne({
    attributes: userExitsInSearchPersonContactBook
      ? [C.PhoneNumber, C.UserName, C.Email]
      : [C.PhoneNumber, C.UserName],
    include: {
      model: GlobalHamUsers,
      attributes: [C.IsSpam],
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
    return res.json({ searchresult: record });
  } else {
    await ContactBook.findAll({
      attributes: [C.PhoneNumber, C.Name],
      include: {
        model: GlobalHamUsers,
        attributes: [C.IsSpam],
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
        return res.json({ searchresult: record });
      })
      .catch((error) => {
        return res
          .status(400)
          .json({ message: "error in search query", error });
      });
  }
}
module.exports = search;
