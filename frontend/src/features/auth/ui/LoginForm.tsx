// frontend/src/features/auth/ui/LoginForm.tsx - Versión con transparencia
import React, { useState } from "react";
import Input from "../../../../public/components/Input";
import Button from "../../../../public/components/Button";

type Props = {
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
  className?: string;
};

export default function LoginForm({ onSubmit, loading = false, className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className={`w-full max-w-md ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(email.trim(), password);
      }}
      noValidate
      aria-live="polite"
    >
      <div className="mb-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@ejemplo.com"
          required
          autoComplete="email"
          className="h-11 bg-white/70 backdrop-blur-sm" // Añade transparencia
        />
      </div>

      <div className="mb-4">
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          className="h-11 bg-white/70 backdrop-blur-sm" // Añade transparencia
        />
      </div>

      <div>
        <Button 
          type="submit" 
          variant="primary" 
          size="md" 
          fullWidth 
          disabled={loading}
          className="backdrop-blur-sm" // Añade transparencia al botón si es posible
        >
          {loading ? "Entrando..." : "Iniciar Sesión"}
        </Button>
      </div>
    </form>
  );
}