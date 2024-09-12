import { useEffect, useState } from "react";

const WEBSOCKET_URL = "ws://localhost:8000/ws";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket(WEBSOCKET_URL);
    setSocket(websocket);
    return () => websocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.onopen = () => {
      console.log("Socket connected");
    };
  }, [socket]);

  function sendMessage() {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = "This is a message";
      socket.send(data);
    } else {
      console.log("Socket not connected");
    }
  }

  return (
    <>
      <h1 className="text-teal-600">Websocket</h1>
      <button onClick={sendMessage}>Send data</button>
    </>
  );
}

export default App;
