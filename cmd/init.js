// Import the Express.js module
const express = require("express");
const hamCallApp = express();

//added json body parser for destructuring req body
const bodyParser = require("body-parser");
hamCallApp.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// intialize gorm orm
const { Sequelize, Op, literal, QueryTypes } = require("sequelize");
const gorm = new Sequelize({
  host: "localhost",
  dialect: "postgres",
  username: "srinukesari",
  database: "hamcall",
  password: "3950",
  port: 5432,
  logging: true,
});
// Enable Sequelize logging
gorm.options.logging = console.log;

module.exports = {
  hamCallApp,
  gorm,
  bcrypt,
  jwt,
  Op,
  literal,
  QueryTypes,
};
