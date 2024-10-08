import { useEffect, useState } from "react";

const WEBSOCKET_URL = "ws://localhost:8000/ws";

function App() {
  // var maze = [
  //   [1, 1, 0, 0, 0],
  //   [0, 1, 0, 1, 0],
  //   [0, 0, 0, 1, 0],
  //   [1, 1, 1, 1, 0],
  //   [0, 0, 0, 0, 0],
  // ];
  // var start_x = 0;
  // var start_y = 0;

  // var end_x = 4;
  // var end_y = 4;

  const [socket, setSocket] = useState(null);
  const [maze, setMaze] = useState([]);

  const [visited, setVisited] = useState([]);

  var start_x = 0;
  var start_y = 0;

  var end_x;
  var end_y = 4;

  const generateMaze = () => {
    const generatedMaze = Array(5)
      .fill()
      .map(() => Array(5).fill(0));
    generatedMaze[0][0] = 1;
    generatedMaze[0][1] = 1;
    generatedMaze[1][1] = 1;
    generatedMaze[1][3] = 1;
    generatedMaze[2][3] = 1;
    generatedMaze[3][0] = 1;
    generatedMaze[3][1] = 1;
    generatedMaze[3][2] = 1;
    generatedMaze[3][3] = 1;

    setMaze(generatedMaze);
    //return generateMaze;
  };

  //Connect to websocket
  useEffect(() => {
    const websocket = new WebSocket(WEBSOCKET_URL);
    setSocket(websocket);

    websocket.onopen = () => {
      console.log("Socket connected");
    };

    websocket.onmessage = (message) => {
      //Todo - Wrap in try catch
      const data = JSON.parse(message.data);
      if (data.visited) {
        setVisited(data.visited);
      }
      //else if (data.result != undefined) {
      //   setVisited(data.visited);
      // }
      console.log(data);
    };

    return () => websocket.close();
  }, []);

  // //Check the connection
  // useEffect(() => {
  //   if (!socket) return;

  //   socket.onopen = () => {
  //     console.log("Socket connected");
  //   };

  // }, [socket]);

  //Send data to the backend
  function sendMessage() {
    if (socket && socket.readyState === WebSocket.OPEN) {
      //const data = { maze, start: [start_x, start_y], end: [end_x, end_y] };
      const data = {
        maze: maze,
        start: [start_x, start_y],
        end: [end_x, end_y],
      };
      socket.send(JSON.stringify(data));
    } else {
      console.log("Socket not connected");
    }
  }

  return (
    <div className="text-center">
      <h1 className="bg-green-400 text-slate-700 text-3xl p-3 rounded-sm ">
        MAZE SOLVER
      </h1>
      <div className="bg-teal-300 m-2 p-2 space-x-5">
        <button
          onClick={generateMaze}
          className="rounded-lg bg-black text-white p-2"
        >
          Generate Maze
        </button>
        <button
          onClick={sendMessage}
          className="rounded-lg bg-black text-white p-2"
        >
          Generate Path
        </button>
      </div>
      {maze.length > 0 && (
        <div className="bg-green-200">
          {maze.map((row, index) => (
            <div key={index} className="flex justify-center p-2">
              <div className="flex">
                {row.map((col, index) => (
                  <div className="flex p-10" key={index}>
                    {col}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visited Nodes */}
      <div>
        <h2>visited path</h2>
        <p>
          {visited.map((data, index) => (
            <span key={index}>
              ({data[0]}, {data[1]})
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default App;
