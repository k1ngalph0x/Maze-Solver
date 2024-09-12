
import json
from typing import List, Tuple
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials = True,
)



@app.websocket("/ws")
async def data_point(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            parsed_data = json.loads(data)
            maze = parsed_data['maze']
            start = parsed_data['start']
            end = parsed_data['end']
            #print(dfs(start, end, maze))
            #websocket.close()
            await depth_first_search(start, end, maze, websocket)
    except Exception as exception:
        print(exception)




async def depth_first_search(start: Tuple[int, int], end: Tuple[int, int], maze: List[List[int]], websocket: WebSocket):
    stack = [start]
    visited = set()
    
    while stack:
        #Current position 
        position = stack.pop()
        x, y = position

        if position == end:
            await websocket.send_json({"result": True, "message":"path found"})
            return True
        
        visited.add((x, y))
        await websocket.send_json({"visited":list(visited)})
        print(visited)

        #Up, down, left, right
        for dx, dy in [(-1, 0), (1, 0), (0, 1), (0, -1)]:
            a, b = x + dx, y + dy
            if (0 <= a < len(maze) and 0 <= b < len(maze[0]) and maze[a][b]==0 and (a, b) not in visited):
                stack.append((a, b))

    await websocket.send_json({"result": False, "message":"path not found"})        
    return False

    