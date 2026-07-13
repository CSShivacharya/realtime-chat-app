require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const sequelize = require("./config/database");
require("./models/Message");

const socketHandler = require("./socket/socketHandler");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

sequelize
  .sync()
  .then(() => {
    console.log("Database Connected");

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database Error:", err);
  });