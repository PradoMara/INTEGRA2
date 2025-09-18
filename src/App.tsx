import React, { useState } from "react";
import Button from "./presentation/components/Button";
import Input from "./presentation/components/Input";
import Textarea from "./presentation/components/Textarea";
import Modal from "./presentation/components/Modal";
import Card from "./presentation/components/Card";
import HelpSection from "./presentation/components/HelpSection";


function App() {
  const [showModal, setShowModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <main className="bg-background min-h-screen font-sans">
      <div className="min-h-screen bg-gray-300 flex flex-col items-center justify-center px-4">
        {/* Botón para alternar vista de ayuda */}
        <div className="w-full max-w-5xl flex justify-end mb-6">
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => setShowHelp((prev) => !prev)}
          >
            {showHelp ? "Volver a demo" : "Ayuda"}
          </Button>
        </div>

        {/* Mostrar sección de ayuda o demo */}
        {showHelp ? (
          <div className="w-full max-w-2xl">
            <HelpSection />
          </div>
        ) : (
          <div className="flex gap-8 w-full max-w-5xl">
            {/* Columna izquierda: Card */}
            <div className="flex-1 flex items-start">
              <Card title="Card de prueba" >
                <p>
                  Esta Card usa las utilidades globales de <strong>padding</strong>, 
                  <strong>margen</strong>, <strong>sombra</strong>, 
                  <strong>colores</strong> y <strong>border radius</strong> definidas en 
                  <code>tailwind.config.js</code>.
                </p>
              </Card>
            </div>
            {/* Columna derecha: Formulario y botones */}
            <div className="flex-[2]">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Botones</h2>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="primary" size="md">Primario</Button>
                    <Button variant="secondary" size="md">Secundario</Button>
                    <Button variant="primary" size="sm">Pequeño</Button>
                    <Button variant="secondary" size="lg">Grande</Button>
                    <Button variant="outline-purple" size="md" disabled>Deshabilitado</Button>
                    <Button variant="outline-purple" size="md" className="">Boton Estilizado</Button>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Inputs</h2>
                  <Input label="Usuario" placeholder="Tu usuario" className="text-black"/>
                  <Input label="Email" placeholder="Correo electrónico" error="Este campo es obligatorio" className="mt-2" />
                  <Textarea label="Descripcion" placeholder="Describe tu producto..." error="Campo obligatorio" className="mt-2" />
                  <Textarea label="Notas" placeholder="Notas adicionales" className="mt-2" />
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
          </div>
        )}
      </div>
    </main>
  );
}

export default App;