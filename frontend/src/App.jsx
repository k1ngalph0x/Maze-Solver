import { useEffect, useState } from "react";

const WEBSOCKET_URL = "ws://localhost:8000/ws";

function App() {
  var maze = [
    [1, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ];
  var start_x = 0;
  var start_y = 0;

  var end_x;
  var end_y = 4;

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
      const data = { maze, start: [start_x, start_y], end: [end_x, end_y] };
      socket.send(JSON.stringify(data));
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
