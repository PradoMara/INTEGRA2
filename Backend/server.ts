// server.ts
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';

// Datos en memoria solo para demo
type Estado = 'enviando'|'enviado'|'recibido'|'leido';
type Mensaje = { id: string; texto: string; autor: 'yo'|'otro'|string; hora: string; estado?: Estado };
type Chat = { id: number; nombre: string; mensajes: Mensaje[] };
const chats: Chat[] = [
  { id: 1,  nombre: "Francisco", mensajes: [] },
  { id: 2,  nombre: "Alejandro", mensajes: [] },
  { id: 3,  nombre: "Mario", mensajes: [] },
  { id: 4,  nombre: "Sebastian", mensajes: [] },
  { id: 5,  nombre: "Carolina", mensajes: [] },
  { id: 6,  nombre: "Valentina", mensajes: [] },
  { id: 7,  nombre: "Soporte", mensajes: [] },
  { id: 8,  nombre: "Camila", mensajes: [] },
  { id: 9,  nombre: "Daniel", mensajes: [] },
  { id:10,  nombre: "Anita", mensajes: [] },
  { id:11,  nombre: "Pablo", mensajes: [] },
  { id:12,  nombre: "Rocío", mensajes: [] },
];

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// REST: lista de chats
app.get('/chats', (_req, res) => {
  const compact = chats.map(c => ({
    id: c.id,
    nombre: c.nombre,
    ultimoMensaje: c.mensajes[c.mensajes.length - 1]?.texto ?? '',
    mensajes: c.mensajes,
  }));
  res.json(compact);
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

type Client = { ws: any; userId?: string; chatId?: number };
const clients = new Set<Client>();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', 'http://localhost');
  const client: Client = { ws, userId: url.searchParams.get('userId') ?? undefined };
  clients.add(client);

  ws.on('message', (buf: Buffer) => {
    try {
      const msg = JSON.parse(buf.toString());
      if (msg.tipo === 'join') {
        client.chatId = Number(msg.chatId);
        return;
      }

      if (msg.tipo === 'mensaje') {
        const chat = chats.find(c => c.id === Number(msg.chatId));
        if (!chat) return;

        const id = 'm' + Date.now();
        const hora = new Date().toTimeString().slice(0,5);
        const nuevo: Mensaje = { id, texto: msg.texto, autor: client.userId || 'yo', hora, estado: 'enviado' };
        chat.mensajes.push(nuevo);

        // broadcast a todos los clientes en ese chat
        const payload = JSON.stringify({ tipo: 'mensaje', chatId: chat.id, mensaje: { ...nuevo, estado: 'recibido' } });
        for (const c of clients) {
          if (c.chatId === chat.id) c.ws.send(payload);
        }
        return;
      }

      if (msg.tipo === 'estado') {
        const { chatId, mensajeId, estado } = msg as { chatId: number; mensajeId?: string; estado: Estado };
        const chat = chats.find(c => c.id === Number(chatId));
        if (!chat) return;

        if (mensajeId) {
          const m = chat.mensajes.find(x => x.id === mensajeId);
          if (m) m.estado = estado;
        } else {
          // fallback: marca mis mensajes como leídos
          chat.mensajes.forEach(m => {
            if (m.autor === (client.userId || 'yo')) m.estado = estado;
          });
        }

        const payload = JSON.stringify({ tipo: 'estado', chatId: chat.id, mensajeId, estado });
        for (const c of clients) {
          if (c.chatId === chat.id) c.ws.send(payload);
        }
        return;
      }
    } catch (e) {
      console.error('WS parse error:', e);
    }
  });

  ws.on('close', () => {
    clients.delete(client);
  });
});

server.listen(3000, () => {
  console.log('HTTP+WS listo en http://localhost:3000');
});
