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

// intialize gorm orm
const { Sequelize, Op, literal, QueryTypes } = require("sequelize");
// const gorm = new Sequelize({
//   host: process.env.HOST,
//   username: process.env.USERNAME,
//   database: process.env.DATABASE,
//   password: process.env.PASSWORD,
//   port: 5432,
//   dialect: "postgres",
//   logging: true,
// });

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
  QueryTypes,
};
