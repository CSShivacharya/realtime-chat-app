import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import socket from "../services/socket";
import api from "../services/api";

function Chat({ username }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    loadMessages();

    socket.emit("join", username);

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("typing", (user) => {
      if (user !== username) {
        setTypingUser(user);
      }
    });

    socket.on("stopTyping", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUser]);

  const loadMessages = async () => {
    try {
      const response = await api.get("/messages");
      setMessages(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTyping = (value) => {
    setMessage(value);

    socket.emit("typing", username);

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping");
    }, 1000);
  };

  const handleSend = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      username,
      message,
    });

    socket.emit("stopTyping");

    setMessage("");
  };

  return (
    <div className="chat-container">
      <div className="chat-card">

        <div className="chat-header">
          <h2>💬 Realtime Chat</h2>

          <p>
            Welcome, <strong>{username}</strong>
          </p>

          <div className="online-box">
            <strong>🟢 Online Users ({onlineUsers.length})</strong>

            {onlineUsers.map((user, index) => (
              <div key={index}>• {user}</div>
            ))}
          </div>
        </div>

        <div className="chat-messages">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.username === username
                  ? "message own-message"
                  : "message other-message"
              }
            >
              <strong>{msg.username}</strong>

              <p>{msg.message}</p>

              <small>
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
          ))}

          {typingUser && (
            <div className="typing-indicator">
              ✍️ <strong>{typingUser}</strong> is typing...
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            autoFocus
          />

          <button onClick={handleSend}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default Chat;