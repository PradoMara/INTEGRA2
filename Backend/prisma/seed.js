// Cargar variables de entorno
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding de la base de datos...');

  try {
    // 1. Crear roles básicos
    const adminRole = await prisma.roles.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, nombre: 'Administrador' }
    });

    const vendedorRole = await prisma.roles.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, nombre: 'Vendedor' }
    });

    const clienteRole = await prisma.roles.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, nombre: 'Cliente' }
    });

    console.log('✅ Roles creados');

    // 2. Crear estados de usuario
    await prisma.estadosUsuario.createMany({
      data: [
        { id: 1, nombre: 'ACTIVO' },
        { id: 2, nombre: 'BANEADO' },
      ],
      skipDuplicates: true,
    });

    const estadoActivo = await prisma.estadosUsuario.findUnique({ where: { id: 1 } });
    
    console.log('✅ Estados de usuario creados');

    // 3. Crear estados de productos
    const estadoDisponible = await prisma.estadosProducto.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, nombre: 'Disponible' }
    });

    const estadoVendido = await prisma.estadosProducto.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, nombre: 'Vendido' }
    });

    const estadoReservado = await prisma.estadosProducto.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, nombre: 'Reservado' }
    });

    console.log('✅ Estados de productos creados');

    // 4. Crear estados de transacciones
    await prisma.estadosTransaccion.upsert({ where: { id: 1 }, update: {}, create: { id: 1, nombre: 'Pendiente' } });
    await prisma.estadosTransaccion.upsert({ where: { id: 2 }, update: {}, create: { id: 2, nombre: 'Completada' } });

    console.log('✅ Estados de transacciones creados');

    // 5. Crear estados de reportes
    const estadoReportePendiente = await prisma.estadosReporte.upsert({ where: { id: 1 }, update: {}, create: { id: 1, nombre: 'Pendiente' } });
    const estadoReporteResuelto = await prisma.estadosReporte.upsert({ where: { id: 2 }, update: {}, create: { id: 2, nombre: 'Resuelto' } });

    console.log('✅ Estados de reportes creados');

    
    // 6. Crear categorías
    await prisma.categorias.deleteMany();
    
    const catElec = await prisma.categorias.create({ data: { nombre: 'Electrónicos' } });
    const catLibros = await prisma.categorias.create({ data: { nombre: 'Libros' } });
    const catDeportes = await prisma.categorias.create({ data: { nombre: 'Deportes' } });
    
    // Subcategorías
    const subComp = await prisma.categorias.create({ data: { nombre: 'Computadoras', categoriaPadreId: catElec.id } });
    const subSmart = await prisma.categorias.create({ data: { nombre: 'Smartphones', categoriaPadreId: catElec.id } });
    const subAcad = await prisma.categorias.create({ data: { nombre: 'Académicos', categoriaPadreId: catLibros.id } });
    
    console.log('✅ Categorías creadas');
    
    // 7. Crear usuarios
    // Limpiamos usuarios existentes para evitar conflictos
    await prisma.cuentas.deleteMany();
    
    const generalPassword = await bcrypt.hash('password123', 12);

    // --- USUARIO PRINCIPAL (TU ID) ---
    // Lo creamos primero para intentar que tome el ID 1
    const miUsuario = await prisma.cuentas.create({
      data: {
        nombre: 'Usuario Principal',
        // apellido: eliminado
        correo: 'prueba.ts@alu.uct.cl',
        usuario: 'usuariots',
        contrasena: generalPassword,
        rolId: clienteRole.id,
        estadoId: estadoActivo.id,
        campus: 'Campus San Francisco',
        reputacion: 5.0,
        fotoPerfilUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
      }
    });
    console.log(`👤 Tu usuario creado con ID: ${miUsuario.id}`);

    // --- AMIGA PARA CHAT ---
    const mariaVentas = await prisma.cuentas.create({
      data: {
        nombre: 'María Ventas',
        correo: 'maria.ventas@alu.uct.cl',
        usuario: 'maria_ventas',
        contrasena: generalPassword,
        rolId: clienteRole.id,
        estadoId: estadoActivo.id,
        campus: 'Campus San Juan Pablo II',
        reputacion: 4.8,
        fotoPerfilUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
      }
    });

    // Admin
    const admin = await prisma.cuentas.create({
      data: {
        nombre: 'Administrador',
        correo: 'admin@uct.cl',
        usuario: 'admin_uct',
        contrasena: await bcrypt.hash('admin123', 12),
        rolId: adminRole.id,
        estadoId: estadoActivo.id,
        campus: 'Campus Temuco',
        reputacion: 5.0
      }
    });
    
    // Vendedor Ejemplo
    const vendor = await prisma.cuentas.create({
      data: {
        nombre: 'Juan Pérez',
        correo: 'vendedor@uct.cl',
        usuario: 'juan_perez',
        contrasena: await bcrypt.hash('vendor123', 12),
        rolId: vendedorRole.id,
        estadoId: estadoActivo.id,
        campus: 'Campus Temuco',
        reputacion: 4.5
      }
    });
    
    console.log('✅ Usuarios clave creados');
    

    // 8. Crear productos
    const productos = [
      {
        nombre: 'Laptop Dell Inspiron 15',
        categoriaId: subComp.id,
        vendedorId: vendor.id,
        precioAnterior: 900000,
        precioActual: 850000,
        descripcion: 'Laptop en excelente estado, uso universitario.',
        calificacion: 4.5,
        cantidad: 1,
        estadoId: estadoDisponible.id
      },
      {
        nombre: 'iPhone 12 64GB',
        categoriaId: subSmart.id,
        vendedorId: admin.id, // Admin vendiendo algo
        precioAnterior: 700000,
        precioActual: 650000,
        descripcion: 'iPhone 12 en muy buen estado, batería al 90%.',
        calificacion: 4.8,
        cantidad: 1,
        estadoId: estadoDisponible.id
      },
      {
        nombre: 'Libro Cálculo Stewart',
        categoriaId: subAcad.id,
        vendedorId: mariaVentas.id, // María vende esto
        precioAnterior: 50000,
        precioActual: 45000,
        descripcion: 'Libro de cálculo casi nuevo, sin rayaduras.',
        calificacion: 4.2,
        cantidad: 1,
        estadoId: estadoDisponible.id
      }
    ];

    for (const producto of productos) {
      await prisma.productos.create({ data: producto });
    }

    console.log('✅ Productos creados');

    // 9. Resúmenes de usuario
    const usuariosConResumen = [miUsuario, mariaVentas, admin, vendor];
    for (const u of usuariosConResumen) {
        await prisma.resumenUsuario.create({
            data: {
                usuarioId: u.id,
                totalProductos: 0,
                totalVentas: 0,
                totalCompras: 0,
                promedioCalificacion: 0.0
            }
        });
    }

    console.log('✅ Resúmenes de usuario creados');

    // 10. Usuarios de prueba masivos (relleno)
    const usuariosDePrueba = [];
    for (let i = 1; i <= 20; i++) {
      usuariosDePrueba.push({
        nombre: `Usuario${i}`,
        correo: `usuario${i}@alu.uct.cl`,
        usuario: `usuario${i}`,
        contrasena: generalPassword,
        rolId: clienteRole.id,
        estadoId: estadoActivo.id,
        campus: 'Campus Temuco',
        reputacion: parseFloat((Math.random() * 5).toFixed(2))
      });
    }

    await prisma.cuentas.createMany({
      data: usuariosDePrueba,
      skipDuplicates: true,
    });

    console.log('✅ Usuarios de relleno creados');

    // 11. Crear Publicaciones (Posts del foro)
    const usuariosDb = await prisma.cuentas.findMany({ select: { id: true } });
    const publicaciones = [];
    
    // Publicación de María
    publicaciones.push({
        titulo: 'Vendo libro de Cálculo urgente',
        cuerpo: 'Necesito vender mi Stewart 7ma edición, entrego en campus SJPII hoy mismo.',
        usuarioId: mariaVentas.id,
        estado: 'Activa',
        fecha: new Date()
    });

    // Publicaciones de relleno
    for (let i = 1; i <= 20; i++) {
      const randomUser = usuariosDb[Math.floor(Math.random() * usuariosDb.length)];
      publicaciones.push({
        titulo: `Consulta sobre ramo ${i}`,
        cuerpo: `¿Alguien tiene material de estudio para el ramo de Introducción a la programación?`,
        usuarioId: randomUser.id,
        estado: 'Activa',
        fecha: new Date()
      });
    }

    await prisma.publicaciones.createMany({ data: publicaciones });
    console.log('✅ Publicaciones creadas');

    // 12. CHAT: Conversación entre TÚ y MARÍA
    console.log('💬 Creando conversación de prueba...');
    const ahora = new Date();
    
    const mensajesChat = [
      {
        remitenteId: miUsuario.id,
        destinatarioId: mariaVentas.id,
        contenido: 'Hola María, ¿aún tienes disponible el libro de Cálculo?',
        tipo: 'texto',
        fechaEnvio: new Date(ahora.getTime() - 1000 * 60 * 60 * 2), // Hace 2 horas
        leido: true
      },
      {
        remitenteId: mariaVentas.id,
        destinatarioId: miUsuario.id,
        contenido: '¡Hola! Sí, todavía lo tengo. Está casi nuevo.',
        tipo: 'texto',
        fechaEnvio: new Date(ahora.getTime() - 1000 * 60 * 55), // Hace 55 min
        leido: true
      },
      {
        remitenteId: miUsuario.id,
        destinatarioId: mariaVentas.id,
        contenido: 'Genial, ¿en qué campus entregas?',
        tipo: 'texto',
        fechaEnvio: new Date(ahora.getTime() - 1000 * 60 * 50),
        leido: true
      },
      {
        remitenteId: mariaVentas.id,
        destinatarioId: miUsuario.id,
        contenido: 'Generalmente en San Juan Pablo II, pero mañana voy al San Francisco.',
        tipo: 'texto',
        fechaEnvio: new Date(ahora.getTime() - 1000 * 60 * 5), // Hace 5 min
        leido: false // ¡No leído para que salga la notificación!
      },
      {
        remitenteId: mariaVentas.id,
        destinatarioId: miUsuario.id,
        contenido: 'Avísame si te acomoda para llevarlo.',
        tipo: 'texto',
        fechaEnvio: new Date(ahora.getTime() - 1000 * 60 * 4), // Hace 4 min
        leido: false
      }
    ];

    for (const m of mensajesChat) {
      await prisma.Mensajes.create({ data: m });
    }
    
    console.log('✅ Mensajes de prueba creados');

    console.log('\n🎉 Seeding completado exitosamente!');
    console.log('------------------------------------------------');
    console.log(`👉 TU USUARIO: ${miUsuario.correo} (Pass: password123)`);
    console.log(`👉 CHAT CON: ${mariaVentas.nombre} (${mariaVentas.correo})`);
    console.log('------------------------------------------------');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });