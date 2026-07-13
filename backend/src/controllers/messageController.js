const Message = require("../models/Message");

// Create a new message
const sendMessage = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { username, message } = req.body;

    if (!username || !message) {
      return res.status(400).json({
        success: false,
        message: "Username and message are required",
      });
    }

    const newMessage = await Message.create({
      username,
      message,
    });

    return res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get all messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [["timestamp", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};