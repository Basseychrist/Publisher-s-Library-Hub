require("dotenv").config();
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 3000;
const SSL_PORT = 443;

// Path to your SSL certificate files
const sslOptions = {
  key: fs.readFileSync("/etc/ssl/private/privkey.pem"), // Update with your actual path
  cert: fs.readFileSync("/etc/ssl/certs/fullchain.pem"), // Update with your actual path
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(SSL_PORT, () => {
  console.log(`HTTPS Server running on port ${SSL_PORT}`);
});

// (Optional) Redirect HTTP to HTTPS
http
  .createServer((req, res) => {
    res.writeHead(301, { Location: "https://" + req.headers.host + req.url });
    res.end();
  })
  .listen(PORT, () => {
    console.log(`HTTP redirect server running on port ${PORT}`);
  });

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
