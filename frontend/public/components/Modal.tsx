import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
  closeOnOverlayClick?: boolean;
  ariaLabel?: string;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className = "",
  closeOnOverlayClick = true,
  ariaLabel,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass =
    size === "sm" ? "max-w-lg" : size === "lg" ? "max-w-4xl" : size === "full" ? "w-full h-full" : "max-w-2xl";

  const dialog = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      aria-hidden={false}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onMouseDown={(e) => {
          if (!closeOnOverlayClick) return;
          // close only when clicking the overlay, not when clicking inside dialog
          if (e.target === e.currentTarget) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={`relative z-10 mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${widthClass} ${className}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 px-4 py-3 border-b">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-sm font-semibold text-gray-900 truncate">
                {title}
              </h2>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            ×
          </button>
        </header>

        <div className="px-4 py-4 text-sm text-gray-700">{children}</div>

        {footer ? (
          <footer className="px-4 py-3 border-t bg-gray-50 flex items-center justify-end gap-2">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}