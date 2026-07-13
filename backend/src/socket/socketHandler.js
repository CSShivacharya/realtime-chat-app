const Message = require("../models/Message");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("sendMessage", async (data) => {
      try {
        const savedMessage = await Message.create({
          username: data.username,
          message: data.message,
        });

        io.emit("receiveMessage", savedMessage);
      } catch (error) {
        console.error("Socket Error:", error);

        socket.emit("errorMessage", {
          message: "Failed to send message",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;