const Message = require("../models/Message");

const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);

    socket.on("join", (username) => {
      onlineUsers.set(socket.id, username);

      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });

    socket.on("typing", (username) => {
      socket.broadcast.emit("typing", username);
    });

    socket.on("stopTyping", () => {
      socket.broadcast.emit("stopTyping");
    });

    socket.on("sendMessage", async (data) => {
      try {
        const saved = await Message.create({
          username: data.username,
          message: data.message,
        });

        io.emit("receiveMessage", saved);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);

      io.emit("onlineUsers", Array.from(onlineUsers.values()));

      socket.broadcast.emit("stopTyping");
    });
  });
};

module.exports = socketHandler;