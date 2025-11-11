/**
 * Ejemplo de uso del UserRepository
 * 
 * Para ejecutar:
 * 1. Asegurar que DATABASE_URL esté en .env
 * 2. Ejecutar: npx ts-node src/repositories/example-usage.ts
 */

import { UserRepository } from './UserRepository';

async function main() {
  const userRepo = new UserRepository();

  console.log('🚀 Ejemplo de uso de UserRepository\n');

  try {
    // 1. Crear usuario
    console.log('1️⃣  Creando usuario...');
    const timestamp = Date.now();
    const newUser = await userRepo.create({
      nombre: 'Demo',
      apellido: 'Usuario',
      correo: `demo${timestamp}@uct.cl`,
      usuario: `demouser${timestamp}`,
      contrasena: 'hash_password_123',
      rol_id: 1,
      estado_id: 1,
      campus: 'Temuco',
    });
    console.log('✅ Usuario creado:', newUser);
    console.log('');

    // 2. Buscar por ID
    console.log('2️⃣  Buscando por ID...');
    const foundById = await userRepo.findById(newUser.id);
    console.log('✅ Usuario encontrado:', foundById?.nombre);
    console.log('');

    // 3. Buscar por email
    console.log('3️⃣  Buscando por email...');
    const foundByEmail = await userRepo.findByEmail(newUser.correo);
    console.log('✅ Usuario encontrado por email:', foundByEmail?.usuario);
    console.log('');

    // 4. Actualizar
    console.log('4️⃣  Actualizando usuario...');
    const updated = await userRepo.update(newUser.id, {
      nombre: 'Demo Actualizado',
      reputacion: 4.8,
    });
    console.log('✅ Usuario actualizado:', updated.nombre, '- Reputación:', updated.reputacion);
    console.log('');

    // 5. Buscar con paginación
    console.log('5️⃣  Listando usuarios con paginación...');
    const result = await userRepo.findMany({
      limit: 5,
      offset: 0,
      orderBy: { field: 'fecha_registro', direction: 'desc' },
    });
    console.log(`✅ Encontrados ${result.data.length} usuarios de ${result.total} totales`);
    console.log('   Primeros:', result.data.slice(0, 2).map(u => u.usuario));
    console.log('');

    // 6. Contar usuarios
    console.log('6️⃣  Contando usuarios...');
    const count = await userRepo.count();
    console.log(`✅ Total de usuarios en BD: ${count}`);
    console.log('');

    // 7. Verificar existencia
    console.log('7️⃣  Verificando existencia...');
    const exists = await userRepo.exists(newUser.id);
    console.log(`✅ Usuario ${newUser.id} existe:`, exists);
    console.log('');

    // 8. Eliminar
    console.log('8️⃣  Eliminando usuario de prueba...');
    await userRepo.delete(newUser.id);
    console.log('✅ Usuario eliminado');
    console.log('');

    // 9. Verificar eliminación
    console.log('9️⃣  Verificando eliminación...');
    const deletedUser = await userRepo.findById(newUser.id);
    console.log('✅ Usuario eliminado correctamente:', deletedUser === null);

    console.log('\n✨ Todas las operaciones CRUD completadas exitosamente!\n');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(() => {
    console.log('🏁 Fin del ejemplo');
    process.exit(0);
  });
