require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    const PORT = process.env.PORT;
    sequelize
      .sync({ alter: true }) // or { force: true } for a fresh start (WARNING: force drops tables!)
      .then(() => {
        console.log("Database synced!");
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
          console.log(`API Docs for render: http://localhost:${PORT}/api-docs`);
          console.log(`Local Host for render: http://localhost:${PORT}`);
          console.log(
            `EC2 Instance for AWS render: http://ec2-16-170-203-248.eu-north-1.compute.amazonaws.com:${PORT}`
          );
        });
      })
      .catch((err) => {
        console.error("Failed to sync database:", err);
      });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
