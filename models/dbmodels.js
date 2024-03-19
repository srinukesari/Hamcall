const { DataTypes } = require("sequelize");
const { gorm } = require("../cmd/init");

const ContactBook = gorm.define("contactbooks", {
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "globalhamusers",
      key: "phonenumber",
    },
  },
  contactbookowner: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "registeredhamusers",
      key: "phonenumber",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
});

const RegisteredHamUsers = gorm.define("registeredhamusers", {
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

const GlobalHamUsers = gorm.define("globalhamusers", {
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
  foreignKey: "id",
  constraints: false,
});
ContactBook.belongsTo(GlobalHamUsers, {
  foreignKey: "id",
  constraints: false,
});

RegisteredHamUsers.hasMany(ContactBook, {
  foreignKey: "id",
  constraints: false,
});
ContactBook.belongsTo(RegisteredHamUsers, {
  foreignKey: "id",
  constraints: false,
});

RegisteredHamUsers.hasOne(GlobalHamUsers, {
  foreignKey: "id",
  constraints: false,
});

module.exports = {
  RegisteredHamUsers,
  GlobalHamUsers,
  ContactBook,
};
