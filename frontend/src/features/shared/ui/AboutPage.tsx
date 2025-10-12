import LoginFooter from '../../auth/ui/LoginFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Acerca de Nosotros</h1>
        <p className="text-gray-600 mt-4">
          Bienvenido a Marketplace UCT. Somos una plataforma dedicada a conectar estudiantes y profesores
          para compartir recursos, ideas y oportunidades.
        </p>
      </header>

      <main className="max-w-4xl text-center">
        <p className="text-gray-700 leading-relaxed">
          Nuestra misión es facilitar la colaboración y el intercambio de conocimientos dentro de la comunidad
          universitaria. Creemos en el poder de la educación y la tecnología para transformar vidas y construir
          un futuro mejor.
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos a través de nuestra página de
          soporte o enviándonos un correo electrónico.
        </p>
      </main>

      <LoginFooter />
    </div>
  );
}