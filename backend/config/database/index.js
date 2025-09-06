const { Sequelize } = require("sequelize");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const useSSL = process.env.DB_SSL === "true";

const sequelizeOptions = {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
};

if (useSSL) {
  sequelizeOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = new Sequelize(process.env.DATABASE_URI, sequelizeOptions);

module.exports = sequelize;
