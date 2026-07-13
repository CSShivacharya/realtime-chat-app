import { useState } from "react";
import Chat from "./pages/Chat";
import Login from "./components/Login";

function App() {
  const [username, setUsername] = useState("");

  const handleJoin = (name) => {
    setUsername(name);
  };

  if (!username) {
    return <Login onJoin={handleJoin} />;
  }

  return <Chat username={username} />;
}

export default App;