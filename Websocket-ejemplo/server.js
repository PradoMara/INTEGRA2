const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (socket) => {
  const nombre = "Usuario_" + Math.floor(Math.random() * 1000);
  console.log(`✅ ${nombre} conectado`);

  // Cuando un cliente envía un mensaje
  socket.on("message", (msg) => {
    console.log(`📩 ${nombre}: ${msg}`);

    // Reenviar a todos los clientes
    server.clients.forEach((cliente) => {
      if (cliente.readyState === WebSocket.OPEN) {
        cliente.send(`${nombre}: ${msg}`);
      }
    });
  });

  socket.on("close", () => {
    console.log(`❌ ${nombre} desconectado`);
  });
});

console.log("🚀 Servidor WebSocket corriendo en ws://localhost:8080");
