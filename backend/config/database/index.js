const { Sequelize } = require("sequelize");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

// Enable SSL only if explicitly set (for Render or RDS with SSL)
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

sequelize
  .sync({ alter: true }) // or { force: true } for a fresh start (WARNING: force drops tables!)
  .then(() => {
    console.log("Database synced!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

module.exports = sequelize;
