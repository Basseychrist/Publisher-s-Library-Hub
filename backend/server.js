require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    const PORT = process.env.PORT ;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`Local Host: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
