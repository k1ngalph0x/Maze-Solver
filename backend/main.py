
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
            print(data)
            #websocket.close()
    except Exception as exception:
        print(exception)




def dfs(start, end, maze):
    stack = [start]
    visited = set()
    

    while stack:
        #Current position 
        position = stack.pop()
        x, y = position

        if position == end:
            return True
        
        visited.add((x, y))
        print(visited)

        #Up, down, left, right
        for dx, dy in [(-1, 0), (1, 0), (0, 1), (0, -1)]:
            a, b = x + dx, y + dy
            if (0 <= a < len(maze) and 0 <= b < len(maze[0]) and maze[a][b]==0 and (a, b) not in visited):
                stack.append((a, b))

        
    return False
    

maze = [
    [1, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
]

current_generation = 0
generation = 0


start = (0, 0)
end = (4, 4)

print(dfs(start, end, maze))