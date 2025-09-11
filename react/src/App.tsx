import { useState } from "react";
import ChatPage from "./CHAT/pages/ChatPage";

function App() {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return <ChatPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold drop-shadow-lg mb-4">
          Bienvenido a <span className="text-yellow-300">UCT Chat</span> 🚀
        </h1>
        <p className="text-lg mb-8 opacity-90">
          Conéctate con tus compañeros y profesores en tiempo real 💬
        </p>

        <button
          onClick={() => setShowChat(true)}
          className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:bg-yellow-300 transition-transform duration-300"
        >
          👉 Ir al Chat
        </button>
      </div>
    </div>
  );
}

export default App;

