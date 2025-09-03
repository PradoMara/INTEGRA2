import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full transition-all duration-200 scale-100 animate-fade-in"
        style={{ animation: "fadeIn 0.2s" }}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ×
        </button>
        {children}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            0% { transform: scale(.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in { animation: fadeIn 0.2s; }
        `}
      </style>
    </div>
  );
};

export default Modal;