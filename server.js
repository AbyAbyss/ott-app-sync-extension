const WebSocket = require("ws");
const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received message:");
      console.table(data);

      switch (data.app) {
        case "netflix":
          handleAppLogic("Netflix", data, ws);
          break;
        case "youtube":
          handleAppLogic("YouTube", data, ws);
          break;
        case "primevideo":
          handleAppLogic("PrimeVideo", data, ws);
          break;
        default:
          console.log("Unsupported app");
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

function handleAppLogic(appName, data, ws) {
  console.log(`Handling ${appName} event: ${data.action}`);
  broadcast(data, ws);
}

function broadcast(data, ws) {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(data));
      } catch (error) {
        console.error("Error broadcasting to client:", error);
      }
    }
  });
}

console.log(`WebSocket server running on ws://localhost:${PORT}`);
