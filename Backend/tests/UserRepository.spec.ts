import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserRepository } from '../src/repositories/UserRepository';
import type { User } from '../src/domain/User';

/**
 * Tests unitarios para UserRepository
 * 
 * IMPORTANTE: Estos tests usan la BD real de desarrollo.
 * Para evitar conflictos, usamos emails únicos con timestamp.
 * 
 * Criterios testeados:
 * 1. Create: inserción correcta
 * 2. FindById: recuperación por ID
 * 3. FindOne: búsqueda por criterios (email, username)
 * 4. FindMany: paginación y filtros
 * 5. Update: modificación
 * 6. Delete: eliminación
 * 7. Exists: verificación de existencia
 * 8. Count: conteo
 */

describe('UserRepository', () => {
  let userRepo: UserRepository;
  let testUser: User | null = null;

  beforeEach(() => {
    userRepo = new UserRepository();
  });

  afterEach(async () => {
    // Limpiar usuario de prueba si fue creado
    if (testUser && testUser.id) {
      try {
        await userRepo.delete(testUser.id);
      } catch {
        // Ignorar si ya fue eliminado
      }
      testUser = null;
    }
  });

  it('debería crear un usuario correctamente', async () => {
    const timestamp = Date.now();
    const input = {
      nombre: 'Test User',
      apellido: 'Apellido Test',
      correo: `test${timestamp}@uct.cl`,
      usuario: `testuser${timestamp}`,
      contrasena: 'hash123',
      rol_id: 1,
      estado_id: 1,
      campus: 'Temuco',
    };

    testUser = await userRepo.create(input);

    expect(testUser).toBeDefined();
    expect(testUser.id).toBeGreaterThan(0);
    expect(testUser.nombre).toBe(input.nombre);
    expect(testUser.correo).toBe(input.correo);
    expect(testUser.reputacion).toBe(0);
  });

  it('debería buscar usuario por ID', async () => {
    // Crear usuario primero
    const timestamp = Date.now();
    testUser = await userRepo.create({
      nombre: 'FindById Test',
      correo: `findbyid${timestamp}@uct.cl`,
      usuario: `findbyid${timestamp}`,
      contrasena: 'hash123',
      rol_id: 1,
      estado_id: 1,
    });

    const found = await userRepo.findById(testUser.id);

    expect(found).toBeDefined();
    expect(found?.id).toBe(testUser.id);
    expect(found?.correo).toBe(testUser.correo);
  });

  it('debería retornar null si el usuario no existe', async () => {
    const notFound = await userRepo.findById(999999);
    expect(notFound).toBeNull();
  });

  it('debería buscar usuario por email', async () => {
    const timestamp = Date.now();
    const email = `findemail${timestamp}@uct.cl`;

    testUser = await userRepo.create({
      nombre: 'Email Test',
      correo: email,
      usuario: `emailtest${timestamp}`,
      contrasena: 'hash123',
      rol_id: 1,
      estado_id: 1,
    });

    const found = await userRepo.findByEmail(email);

    expect(found).toBeDefined();
    expect(found?.correo).toBe(email);
  });

  it('debería buscar usuario por username', async () => {
    const timestamp = Date.now();
    const username = `usertest${timestamp}`;

    testUser = await userRepo.create({
      nombre: 'Username Test',
      correo: `usernametest${timestamp}@uct.cl`,
      usuario: username,
      contrasena: 'hash123',
      rol_id: 1,
      estado_id: 1,
    });

    const found = await userRepo.findByUsername(username);

    expect(found).toBeDefined();
    expect(found?.usuario).toBe(username);
  });

  it('debería actualizar un usuario', async () => {
    const timestamp = Date.now();
    testUser = await userRepo.create({
      nombre: 'Original Name',
      correo: `update${timestamp}@uct.cl`,
      usuario: `updatetest${timestamp}`,
      contrasena: 'hash123',
      rol_id: 1,
      estado_id: 1,
    });

    const updated = await userRepo.update(testUser.id, {
      nombre: 'Updated Name',
      apellido: 'New Apellido',
    });

    expect(updated.nombre).toBe('Updated Name');
    expect(updated.apellido).toBe('New Apellido');
    expect(updated.correo).toBe(testUser.correo); // No cambió
  });

  it('debería eliminar un usuario', async () => {
    const timestamp = Date.now();
    testUser = await userRepo.create({
      nombre: 'Delete Test',
      correo: `delete${timestamp}@uct.cl`,
      usuario: `deletetest${timestamp}`,
      contrasena: 'hash123',
      rol_id: 1,
      estado_id: 1,
    });

    const id = testUser.id;
    await userRepo.delete(id);

    const found = await userRepo.findById(id);
    expect(found).toBeNull();

    testUser = null; // Ya eliminado
  });

  it('debería verificar existencia de usuario', async () => {
    const timestamp = Date.now();
    testUser = await userRepo.create({
      nombre: 'Exists Test',
      correo: `exists${timestamp}@uct.cl`,
      usuario: `existstest${timestamp}`,
      contrasena: 'hash123',
      rol_id: 1,
      estado_id: 1,
    });

    const exists = await userRepo.exists(testUser.id);
    expect(exists).toBe(true);

    const notExists = await userRepo.exists(999999);
    expect(notExists).toBe(false);
  });

  it('debería contar usuarios', async () => {
    const initialCount = await userRepo.count();
    expect(initialCount).toBeGreaterThanOrEqual(0);

    const timestamp = Date.now();
    testUser = await userRepo.create({
      nombre: 'Count Test',
      correo: `count${timestamp}@uct.cl`,
      usuario: `counttest${timestamp}`,
      contrasena: 'hash123',
      rol_id: 1,
      estado_id: 1,
    });

    const newCount = await userRepo.count();
    expect(newCount).toBe(initialCount + 1);
  });

  it('debería paginar resultados con findMany', async () => {
    // Crear múltiples usuarios
    const timestamp = Date.now();
    const users: User[] = [];

    for (let i = 0; i < 3; i++) {
      const u = await userRepo.create({
        nombre: `Paginated User ${i}`,
        correo: `paginated${timestamp}_${i}@uct.cl`,
        usuario: `pagintest${timestamp}_${i}`,
        contrasena: 'hash123',
        rol_id: 1,
        estado_id: 1,
      });
      users.push(u);
    }

    const result = await userRepo.findMany({
      limit: 2,
      offset: 0,
      orderBy: { field: 'id', direction: 'asc' },
    });

    expect(result.data.length).toBeGreaterThanOrEqual(2);
    expect(result.total).toBeGreaterThanOrEqual(3);

    // Limpiar
    for (const u of users) {
      await userRepo.delete(u.id);
    }
  });

  it('debería buscar usuarios por campus', async () => {
    const timestamp = Date.now();
    testUser = await userRepo.create({
      nombre: 'Campus Test',
      correo: `campus${timestamp}@uct.cl`,
      usuario: `campustest${timestamp}`,
      contrasena: 'hash123',
      rol_id: 1,
      estado_id: 1,
      campus: 'Temuco',
    });

    const result = await userRepo.findByCampus('Temuco', 10, 0);

    expect(result.data.length).toBeGreaterThan(0);
    const found = result.data.find((u) => u.id === testUser!.id);
    expect(found).toBeDefined();
  });
});
