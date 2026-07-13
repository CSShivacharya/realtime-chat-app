import axios from "axios";

const api = axios.create({
  baseURL:  "https://realtime-chat-app-production-90cd.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;