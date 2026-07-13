const express = require("express");

const cors = require("cors");

const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Realtime Chat API is running",
  });
});

module.exports = app;