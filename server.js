//https://blog.logrocket.com/websocket-tutorial-real-time-node-react/

const express = require("express");
const { WebSocketServer, WebSocket } = require("ws");
const uuid = require("uuid");

const webSocketServer = new WebSocketServer({ port: 8080 });
const app = express();
const port = 3000;

app.use(express.static("public"));

app.use((req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const clients = [];

webSocketServer.on("connection", (connection) => {
  const userId = uuid.v4();
  clients[userId] = connection;
  connection.send("Welcome to the chat, enjoy :)");
  connection.on('close', () => console.log('Client has disconnected!'))
  connection.on("message", (message) => {
    broadcastMessage(message, connection);
  });
  
});


function broadcastMessage(message, connection) {
  try {
    let messageObject = JSON.parse(message);

    messageObject.sendDate = new Date();

    if (messageObject.type === "NEW_MESSAGE") {
      for (let userId in clients) {
        let client = clients[userId];
        if (client !== connection && client.readyState === WebSocket.OPEN) {
          messageObject.userId = userId;
          client.send(JSON.stringify(messageObject));
        }
      }
    }
  } catch (e) {
    sendError("Wrong format", connection);
  }
}

function sendError(message, connection) {
  const messageObject = {
    type: "ERROR",
    payload: message,
  };

  connection.send(JSON.stringify(messageObject));
}
