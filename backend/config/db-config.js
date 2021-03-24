require("dotenv").config();

module.exports = {
  HOST: "localhost",
  USER: process.env.NAME,
  PASSWORD: process.env.PASSWORD,
  DB: "groupomania",
};
