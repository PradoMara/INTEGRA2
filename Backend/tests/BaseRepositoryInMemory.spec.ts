import { describe, it, expect } from 'vitest';
import { BaseRepository } from '../src/repositories/base/BaseRepository';
import { InMemoryModel } from '../src/repositories/base/InMemoryModel';
import { RepositoryError, RepositoryErrorCode } from '../src/repositories/errors';

interface DemoEntity { id: number; name: string; score: number; createdAt: Date }
interface CreateDemo { name: string; score?: number }
interface UpdateDemo { name?: string; score?: number }
interface WhereDemo { id?: number; name?: string }

class DemoRepository extends BaseRepository<DemoEntity, CreateDemo, UpdateDemo, WhereDemo, InMemoryModel<DemoEntity>> {}

describe('BaseRepository (InMemory)', () => {
  const model = new InMemoryModel<DemoEntity>();
  const repo = new DemoRepository({
    modelDelegate: model,
    entityName: 'Demo',
    mapper: {
      toDomain: (e) => e,
      toOrm: (d) => d,
    },
  });

  it('create y findById', async () => {
    const created = await repo.create({ name: 'A', score: 10 });
    const found = await repo.findById(created.id);
    expect(found?.name).toBe('A');
  });

  it('update', async () => {
    const created = await repo.create({ name: 'B', score: 5 });
    const updated = await repo.update(created.id, { score: 7 });
    expect(updated.score).toBe(7);
  });

  it('delete', async () => {
    const created = await repo.create({ name: 'C' });
    await repo.delete(created.id);
    const again = await repo.findById(created.id);
    expect(again).toBeNull();
  });

  it('paginación offset', async () => {
    for (let i = 0; i < 5; i++) await repo.create({ name: 'P' + i });
    const page = await repo.findMany({ limit: 2, offset: 0, orderBy: { field: 'id', direction: 'asc' } });
    expect(page.data.length).toBe(2);
    expect(page.hasMore).toBe(true);
  });

  it('invalid pagination mixing cursor and offset', async () => {
    await expect(repo.findMany({ cursor: 1, offset: 0 })).rejects.toBeInstanceOf(RepositoryError);
  });
});
