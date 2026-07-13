import { io } from "socket.io-client";

const socket = io( "https://realtime-chat-app-production-90cd.up.railway.app", {
  transports: ["websocket"],
});

export default socket;