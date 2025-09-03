import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input: React.FC<InputProps> = ({ error, className = "", ...props }) => (
  <div>
    <input
      className={`
        w-full px-4 py-2 border rounded-md transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-400
        ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300"}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default Input;