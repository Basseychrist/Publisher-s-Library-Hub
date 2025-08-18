require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URI, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "development"
        ? false
        : { rejectUnauthorized: false },
  },
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(
      "✅ Connection to PostgreSQL has been established successfully."
    );
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

testConnection();

module.exports = sequelize;
