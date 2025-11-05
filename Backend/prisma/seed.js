// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seeding...');

  // 1. Roles
  const roles = await prisma.rol.createMany({
    data: [
      { id: 1, nombre: 'ADMIN' },
      { id: 2, nombre: 'USER' },
      { id: 3, nombre: 'MODERADOR' },
    ],
    skipDuplicates: true,
  });
  console.log(`Creados ${roles.count} roles.`);

  // 2. Estados de Usuario
  const estadosUsuario = await prisma.estadoUsuario.createMany({
    data: [
      { id: 1, nombre: 'Activo' },
      { id: 2, nombre: 'Inactivo' },
      { id: 3, nombre: 'Bloqueado' },
    ],
    skipDuplicates: true,
  });
  console.log(`Creados ${estadosUsuario.count} estados de usuario.`);

  // 3. Estados de Producto
  const estados = await prisma.estadoProducto.createMany({
    data: [
      { id: 1, nombre: 'Disponible' },
      { id: 2, nombre: 'Vendido' },
      { id: 3, nombre: 'Reservado' },
    ],
    skipDuplicates: true,
  });
  console.log(`Creados ${estados.count} estados de producto.`);

  // 4. Categorías
  const categorias = await prisma.categoria.createMany({
    data: [
      { id: 10, nombre: 'Electrónicos' },
      { id: 20, nombre: 'Libros y Materiales' },
      { id: 30, nombre: 'Ropa y Accesorios' },
      { id: 40, nombre: 'Deportes' },
      { id: 50, nombre: 'Servicios y Otros' },
    ],
    skipDuplicates: true,
  });
  console.log(`Creadas ${categorias.count} categorías.`);
  
  // 5. Cuenta de Prueba (Vendedor)
  const vendedor = await prisma.cuenta.upsert({
    where: { correo: 'vendedor.prueba@alu.uct.cl' },
    update: {},
    create: {
      nombre: 'Vendedor',
      apellido: 'Prueba',
      correo: 'vendedor.prueba@alu.uct.cl',
      usuario: 'vendedor1',
      contrasena: 'hashed_password_safe', // Recuerda hashear esto en producción
      rolId: 2, // USER
      estadoId: 1, // 'Activo'
      campus: 'San Juan Pablo II',
      reputacion: 4.5,
      avatarUrl: 'https://i.pravatar.cc/150?u=vendedor1', // Avatar de ejemplo
    },
  });
  console.log(`Vendedor de prueba: ${vendedor.usuario} (ID: ${vendedor.id})`);

  // --- ¡NUEVO! ---
  // 6. Eliminar productos antiguos de este vendedor
  // Esto hace que el script sea "idempotente" (se puede ejecutar varias veces)
  console.log(`Eliminando productos antiguos del vendedor ${vendedor.id}...`);
  await prisma.producto.deleteMany({
    where: { vendedorId: vendedor.id },
  });

  // 7. Crear nuevas Publicaciones (Productos)
  console.log('Creando nuevas publicaciones...');
  const imageUrl = 'https://res.cloudinary.com/dpblhc3yg/image/upload/v1761010155/marketplace_products/xniclnf5qob4fgbypnym.png';

  // Usamos create anidado para crear el Producto y su ImagenProducto en un paso
  const productosData = [
    {
      nombre: 'Libro de Cálculo I (Usado)',
      descripcion: 'Libro de Cálculo I, edición 2020. En buen estado, algunas páginas marcadas con destacador.',
      precioActual: 15000,
      cantidad: 1,
      condicion: 'Usado',
      vendedorId: vendedor.id,
      estadoId: 1, // Disponible
      categoriaId: 20, // Libros y Materiales
      imagenes: {
        create: [{ urlImagen: imageUrl }],
      },
    },
    {
      nombre: 'Mouse Gamer Logitech G203',
      descripcion: 'Mouse gamer con 6 botones programables y RGB. Poco uso, funciona perfecto.',
      precioActual: 20000,
      cantidad: 1,
      condicion: 'Usado',
      vendedorId: vendedor.id,
      estadoId: 1, // Disponible
      categoriaId: 10, // Electrónicos
      imagenes: {
        create: [{ urlImagen: imageUrl }],
      },
    },
    {
      nombre: 'Polerón UCT Talla M (Vendido)',
      descripcion: 'Polerón oficial de la UCT, talla M. Está vendido.',
      precioActual: 10000,
      cantidad: 1,
      condicion: 'Usado',
      vendedorId: vendedor.id,
      estadoId: 2, // Vendido
      categoriaId: 30, // Ropa y Accesorios
      imagenes: {
        create: [{ urlImagen: imageUrl }],
      },
    },
    {
      nombre: 'Clases de Guitarra (Online)',
      descripcion: 'Ofrezco clases de guitarra acústica para principiantes. 5.000 la hora por Zoom.',
      precioActual: 5000,
      cantidad: 10, // Stock para servicios
      condicion: 'N/A',
      vendedorId: vendedor.id,
      estadoId: 1, // Disponible
      categoriaId: 50, // Servicios y Otros
      imagenes: {
        create: [{ urlImagen: imageUrl }],
      },
    },
    {
      nombre: 'Balón de Fútbol N°5',
      descripcion: 'Balón de fútbol en buen estado, ideal para jugar en el campus.',
      precioActual: 8000,
      cantidad: 1,
      condicion: 'Usado',
      vendedorId: vendedor.id,
      estadoId: 1, // Disponible
      categoriaId: 40, // Deportes
      imagenes: {
        create: [{ urlImagen: imageUrl }],
      },
    },
    {
      nombre: 'Apuntes de Anatomía Impresos',
      descripcion: 'Todos los apuntes de anatomía del primer año, impresos y anillados.',
      precioActual: 12000,
      cantidad: 1,
      condicion: 'Usado',
      vendedorId: vendedor.id,
      estadoId: 1, // Disponible
      categoriaId: 20, // Libros y Materiales
      imagenes: {
        create: [{ urlImagen: imageUrl }],
      },
    },
    {
      nombre: 'Teclado Mecánico Redragon',
      descripcion: 'Teclado mecánico con switches rojos. Le falta la tecla F1, por eso el precio.',
      precioActual: 25000,
      cantidad: 1,
      condicion: 'Con detalles',
      vendedorId: vendedor.id,
      estadoId: 1, // Disponible
      categoriaId: 10, // Electrónicos
      imagenes: {
        create: [{ urlImagen: imageUrl }],
      },
    },
    {
      nombre: 'Zapatillas de Running Nike (Poco Uso)',
      descripcion: 'Talla 42, usadas solo un par de veces. Me quedaron pequeñas.',
      precioActual: 30000,
      cantidad: 1,
      condicion: 'Casi Nuevo',
      vendedorId: vendedor.id,
      estadoId: 1, // Disponible
      categoriaId: 30, // Ropa y Accesorios
      imagenes: {
        create: [{ urlImagen: imageUrl }],
      },
    },
  ];

  // Creamos todas las publicaciones en una sola transacción
  const createPromises = productosData.map(data => 
    prisma.producto.create({ data })
  );
  
  await prisma.$transaction(createPromises);
  console.log(`Creados ${productosData.length} productos de prueba.`);
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seeding finalizado.');
    await prisma.$disconnect();
  });