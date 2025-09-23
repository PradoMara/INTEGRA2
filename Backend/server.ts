import express = require("express");
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Simulación en memoria
let chats: any[] = [
  { id: 1, nombre: "Juan Pérez", mensajes: [] },
  { id: 2, nombre: "María López", mensajes: [] },
];

// GET chats
app.get("/chats", (req, res) => {
  res.json(chats);
});

// POST crear chat
app.post("/chats", (req, res) => {
  const nuevo = { id: Date.now(), nombre: req.body.nombre, mensajes: [] };
  chats.push(nuevo);
  res.status(201).json(nuevo);
});

// GET mensajes
app.get("/chats/:id/mensajes", (req, res) => {
  const chat = chats.find((c) => c.id == req.params.id);
  if (!chat) return res.status(404).json({ error: "Chat no encontrado" });
  res.json(chat.mensajes);
});

// POST enviar mensaje
app.post("/mensajes", (req, res) => {
  const { chatId, texto, autor, hora } = req.body;
  const chat = chats.find((c) => c.id == chatId);
  if (!chat) return res.status(404).json({ error: "Chat no encontrado" });

  const nuevo = { id: Date.now(), texto, autor, hora, estado: "enviado" };
  chat.mensajes.push(nuevo);

  // Emitir a todos los clientes
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ tipo: "nuevo", chatId, mensaje: nuevo }));
    }
  });

  res.status(201).json(nuevo);
});

// Iniciar HTTP
const server = app.listen(3000, () => {
  console.log("Servidor REST en http://localhost:3000");
});

// WebSocket
const wss = new WebSocketServer({ server });
wss.on("connection", (socket) => {
  console.log("Cliente conectado vía WS");

  socket.on("message", (raw) => {
    const data = JSON.parse(raw.toString());

    if (data.tipo === "estado") {
      // reenviar actualización de estado
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });
});
