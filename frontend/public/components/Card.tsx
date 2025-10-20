import React from "react";

type CardProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
};

export default function Card({
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  footer,
  children,
  className = "",
  onClick,
  role = "group",
}: CardProps) {
  return (
    <article
      role={role}
      onClick={onClick}
      className={`w-full bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      {imageSrc ? (
        <div className="w-full h-44 bg-gray-100 overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <header className="px-4 pt-4 pb-2">
        {title ? (
          <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
        ) : null}
        {subtitle ? (
          <p className="mt-1 text-xs text-gray-500 truncate">{subtitle}</p>
        ) : null}
      </header>

      <div className="px-4 py-2 flex-1 text-sm text-gray-700">
        {children}
      </div>

      {footer ? (
        <footer className="px-4 py-3 border-t bg-white flex items-center justify-between gap-3">
          <div className="text-xs text-gray-500">{/* left slot (optional) */}</div>
          <div className="ml-auto flex items-center gap-2">{footer}</div>
        </footer>
      ) : null}
    </article>
  );
}