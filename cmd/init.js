// Import the Express.js module
const express = require("express");
const hamCallApp = express();

//added json body parser for destructuring req body
const bodyParser = require("body-parser");
hamCallApp.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pg = require("pg");

require("dotenv").config();

const { Sequelize, Op, literal } = require("sequelize");

// intialize gorm orm
const gorm = new Sequelize(process.env.POSTGRES_CONN, {
  dialectModule: pg,
});

module.exports = {
  hamCallApp,
  gorm,
  bcrypt,
  jwt,
  Op,
  literal,
};
