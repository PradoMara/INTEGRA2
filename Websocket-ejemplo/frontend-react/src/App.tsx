import { useEffect, useState } from "react";

function App() {
  const [mensajes, setMensajes] = useState<string[]>([]);
  const [entrada, setEntrada] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("✅ Conectado al servidor WebSocket");
    };

    ws.onmessage = (event) => {
      setMensajes((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("❌ Conexión cerrada");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const enviar = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(entrada);
      setEntrada("");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 rounded shadow mt-10">
      <h1 className="text-xl font-bold mb-2">💬 Chat en tiempo real</h1>

      <div className="border h-64 p-2 overflow-y-auto bg-white rounded mb-2">
        {mensajes.map((msg, i) => (
          <div key={i} className="p-1 border-b">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          className="flex-1 p-2 border rounded-l"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r"
          onClick={enviar}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default App;
