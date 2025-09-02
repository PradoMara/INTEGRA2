import React from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const base =
    "px-6 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed";
  const primary = "bg-blue-600 text-white hover:bg-blue-700";
  const secondary = "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50";

  const styles =
    variant === "primary"
      ? `${base} ${primary}`
      : `${base} ${secondary}`;

  return (
    <button className={`${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;