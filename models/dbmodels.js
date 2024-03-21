const { DataTypes } = require("sequelize");
const { gorm } = require("../cmd/init");
const { C, Model } = require("../contants");

const ContactBook = gorm.define(Model.ContactBooks, {
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Model.GlobalHamUsers,
      key: C.PhoneNumber,
    },
  },
  contactbookowner: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Model.RegisteredHamUsers,
      key: C.PhoneNumber,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
});

const RegisteredHamUsers = gorm.define(Model.RegisteredHamUsers, {
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(val) {
      this.setDataValue("password", val);
    },
    validate: {
      isLongEnough(val) {
        if (val.length < 3) {
          throw new Error("Please choose a longer password");
        }
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    email: true,
  },
});

const GlobalHamUsers = gorm.define(Model.GlobalHamUsers, {
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  is_spam: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

GlobalHamUsers.hasMany(ContactBook, {
  foreignKey: C.Id,
  constraints: false,
});
ContactBook.belongsTo(GlobalHamUsers, {
  foreignKey: C.Id,
  constraints: false,
});

RegisteredHamUsers.hasMany(ContactBook, {
  foreignKey: C.Id,
  constraints: false,
});
ContactBook.belongsTo(RegisteredHamUsers, {
  foreignKey: C.Id,
  constraints: false,
});

RegisteredHamUsers.hasOne(GlobalHamUsers, {
  foreignKey: C.Id,
  constraints: false,
});

module.exports = {
  RegisteredHamUsers,
  GlobalHamUsers,
  ContactBook,
};
