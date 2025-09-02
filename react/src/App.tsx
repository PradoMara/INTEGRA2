import { useState } from "react";
import Button from "./components/Button";
import Input from "./components/Input";
import Textarea from "./components/Textarea";
import Modal from "./components/Modal";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [inputError, setInputError] = useState("Este campo es obligatorio");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-neutral-900">
      {/* Botones */}
      <div className="flex gap-4">
        <Button variant="primary">Primario</Button>
        <Button variant="secondary">Secundario</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>

      {/* Input y Textarea */}
      <div className="flex flex-col gap-4 w-80">
        <Input placeholder="Input normal" />
        <Input placeholder="Input con error" error={inputError} />
        <Textarea placeholder="Textarea normal" />
        <Textarea placeholder="Textarea con error" error={inputError} />
      </div>

      {/* Modal */}
      <Button onClick={() => setShowModal(true)}>
        Abrir Modal
      </Button>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-bold mb-4">Este es un Modal</h2>
        <p>Puedes cerrarme haciendo click en la X.</p>
      </Modal>
    </div>
  );
}

export default App;