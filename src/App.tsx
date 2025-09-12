import React, { useState } from "react";
import Button from "./components/Button";
import Input from "./components/Input";
import Textarea from "./components/Textarea";
import Modal from "./components/Modal";

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-600 flex flex-col items-center justify-center gap-8 px-4">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Botones</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="md">Primario</Button>
            <Button variant="secondary" size="md">Secundario</Button>
            <Button variant="primary" size="sm">Pequeño</Button>
            <Button variant="primary" size="lg">Grande</Button>
            <Button variant="outline-purple" size="md" disabled>Deshabilitado</Button>
            <Button variant="outline-purple" size="md" className="">Boton Estilizado</Button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Inputs</h2>
          <Input label="Usuario" placeholder="Tu usuario" className="text-black"/>
          <Input label="Email" placeholder="Correo electrónico" error="Este campo es obligatorio" className="mt-2" />
          <Textarea label="Descripcion" placeholder="Escribe tu mensaje..." className="mt-2" />
          <Textarea label="Notas" placeholder="Notas adicionales" error="Campo obligatorio" className="mt-2" />
        </div>
        <div>
          <Button onClick={() => setShowModal(true)} size="md">Abrir Modal</Button>
          <Modal open={showModal} onClose={() => setShowModal(false)}>
            <h2 className="text-lg font-bold mb-2">Este es un Modal</h2>
            <p>Contenido de prueba para verificar responsividad.</p>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default App;