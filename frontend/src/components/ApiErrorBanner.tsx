import React from "react";

export default function ApiErrorBanner({ message, onClose }: { message: string | null; onClose?: ()=>void }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3">
        <div className="flex-1 text-sm leading-tight">
          <strong className="block text-sm mb-1">Error</strong>
          <div>{message}</div>
        </div>
        <button aria-label="Cerrar" onClick={onClose} className="text-white/80 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  );
}