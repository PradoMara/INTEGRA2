// Cargar variables de entorno
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function ensureCategory(nombre, categoriaPadreId = null) {
  const existing = await prisma.categorias.findFirst({
    where: { nombre, categoriaPadreId },
    select: { id: true },
  });
  if (existing) return existing;
  return prisma.categorias.create({ data: { nombre, categoriaPadreId } });
}

async function main() {
  console.log('🌱 Semilla de categorías (no destructiva) iniciada...');

  // Principales
  const catVehiculos = await ensureCategory('Vehículos');
  const catPropiedades = await ensureCategory('Propiedades');
  const catElectro = await ensureCategory('Electrónicos');
  const catHogar = await ensureCategory('Hogar y Jardín');
  const catRopa = await ensureCategory('Ropa y Accesorios');
  const catFamilia = await ensureCategory('Familia');
  const catOcio = await ensureCategory('Ocio y Entretenimiento');
  const catMascotas = await ensureCategory('Mascotas');
  const catDeportes = await ensureCategory('Deportes');
  const catJuguetes = await ensureCategory('Juguetes y Juegos');
  const catServicios = await ensureCategory('Servicios');
  const catEmpleos = await ensureCategory('Empleos');
  const catGratis = await ensureCategory('Gratis');
  const catClasificados = await ensureCategory('Clasificados');
  const catLibros = await ensureCategory('Libros');

  // Vehículos
  await ensureCategory('Autos', catVehiculos.id);
  await ensureCategory('Motos', catVehiculos.id);
  await ensureCategory('Camionetas y SUV', catVehiculos.id);
  await ensureCategory('Repuestos y Accesorios', catVehiculos.id);
  await ensureCategory('Bicicletas', catVehiculos.id);

  // Propiedades
  await ensureCategory('Arriendo', catPropiedades.id);
  await ensureCategory('Venta', catPropiedades.id);
  await ensureCategory('Habitaciones', catPropiedades.id);

  // Electrónicos
  await ensureCategory('Computadoras', catElectro.id);
  await ensureCategory('Laptops', catElectro.id);
  await ensureCategory('Smartphones', catElectro.id);
  await ensureCategory('Tablets', catElectro.id);
  await ensureCategory('Audio y Parlantes', catElectro.id);
  await ensureCategory('Consolas y Videojuegos', catElectro.id);
  await ensureCategory('Accesorios', catElectro.id);

  // Hogar y Jardín
  await ensureCategory('Muebles', catHogar.id);
  await ensureCategory('Electrodomésticos', catHogar.id);
  await ensureCategory('Decoración', catHogar.id);
  await ensureCategory('Herramientas', catHogar.id);
  await ensureCategory('Jardinería', catHogar.id);

  // Ropa y Accesorios
  await ensureCategory('Hombre', catRopa.id);
  await ensureCategory('Mujer', catRopa.id);
  await ensureCategory('Niños', catRopa.id);
  await ensureCategory('Calzado', catRopa.id);
  await ensureCategory('Bolsos y Accesorios', catRopa.id);

  // Familia
  await ensureCategory('Bebés', catFamilia.id);
  await ensureCategory('Cuidado infantil', catFamilia.id);

  // Ocio y Entretenimiento
  await ensureCategory('Libros y Revistas', catOcio.id);
  await ensureCategory('Música e Instrumentos', catOcio.id);
  await ensureCategory('Coleccionables', catOcio.id);

  // Mascotas
  await ensureCategory('Alimentos y Accesorios', catMascotas.id);
  await ensureCategory('Adopciones', catMascotas.id);

  // Deportes
  await ensureCategory('Fitness', catDeportes.id);
  await ensureCategory('Ciclismo', catDeportes.id);
  await ensureCategory('Fútbol', catDeportes.id);

  // Juguetes y Juegos
  await ensureCategory('Juegos de Mesa', catJuguetes.id);
  await ensureCategory('Juguetes Educativos', catJuguetes.id);

  // Servicios / Empleos / Clasificados / Gratis
  await ensureCategory('Clases particulares', catServicios.id);
  await ensureCategory('Reparaciones', catServicios.id);
  await ensureCategory('Limpieza', catServicios.id);

  await ensureCategory('Tiempo completo', catEmpleos.id);
  await ensureCategory('Medio tiempo', catEmpleos.id);
  await ensureCategory('Freelance', catEmpleos.id);

  await ensureCategory('Anuncios', catClasificados.id);
  await ensureCategory('Intercambios', catClasificados.id);

  await ensureCategory('Regalos', catGratis.id);

  // Libros
  await ensureCategory('Académicos', catLibros.id);
  await ensureCategory('Ficción', catLibros.id);
  await ensureCategory('No Ficción', catLibros.id);

  console.log('✅ Categorías insertadas/aseguradas sin borrar datos');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed de categorías:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });