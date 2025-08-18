require("dotenv").config();
require("./config/passport");
const { app, connectDB } = require("./app");

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` API Docs: http://localhost:${PORT}/api-docs`);
  });
};

startServer();

module.exports = app;
