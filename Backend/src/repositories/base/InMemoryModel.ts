/**
 * InMemoryModel: stub minimal que emula subset API de Prisma delegate
 * Métodos soportados: create, findUnique, findFirst, findMany, update, delete, count
 */
export interface InMemoryEntity { id: number; [k: string]: any }

export class InMemoryModel<T extends InMemoryEntity> {
  private data: T[] = [];
  private autoId = 1;
  constructor(initial: Partial<T>[] = []) {
    for (const item of initial) {
      this.data.push({ ...(item as T), id: this.autoId++ });
    }
  }

  create({ data }: { data: Partial<T> }): T {
    const entity = { ...(data as T), id: this.autoId++ };
    this.data.push(entity);
    return entity;
  }

  findUnique({ where, select }: { where: any; select?: any }): T | null {
    const key = Object.keys(where)[0];
    const val = where[key];
    const found = this.data.find(d => d[key] === val) || null;
    if (!found) return null;
    if (select) {
      // devolver solo campos seleccionados
      const partial: any = {};
      for (const k of Object.keys(select)) {
        if (k in found) partial[k] = (found as any)[k];
      }
      return partial as T;
    }
    return found;
  }

  findFirst({ where }: { where: any }): T | null {
    if (!where || Object.keys(where).length === 0) return this.data[0] || null;
    return (
      this.data.find(item => Object.entries(where).every(([k, v]) => item[k] === v)) || null
    );
  }

  findMany(query: any): T[] {
    let results = [...this.data];
    if (query.where && Object.keys(query.where).length > 0) {
      results = results.filter(item =>
        Object.entries(query.where).every(([k, v]) => item[k] === v)
      );
    }
    if (query.orderBy) {
      const key = Object.keys(query.orderBy)[0];
      const dir = query.orderBy[key];
      results.sort((a, b) => (a as any)[key] < (b as any)[key] ? (dir === 'asc' ? -1 : 1) : (a as any)[key] > (b as any)[key] ? (dir === 'asc' ? 1 : -1) : 0);
    }
    if (query.cursor) {
      const key = Object.keys(query.cursor)[0];
      const val = query.cursor[key];
      const idx = results.findIndex(r => (r as any)[key] === val);
      if (idx >= 0) {
        results = results.slice(idx + (query.skip || 0));
      }
    } else if (query.skip) {
      results = results.slice(query.skip);
    }
    if (query.take !== undefined) {
      results = results.slice(0, query.take);
    }
    return results;
  }

  update({ where, data }: { where: any; data: Partial<T> }): T {
    const key = Object.keys(where)[0];
    const val = where[key];
    const idx = this.data.findIndex(d => d[key] === val);
    if (idx === -1) throw Object.assign(new Error('Not found'), { code: 'P2025' });
    this.data[idx] = { ...this.data[idx], ...(data as any) };
    return this.data[idx];
  }

  delete({ where }: { where: any }): void {
    const key = Object.keys(where)[0];
    const val = where[key];
    const idx = this.data.findIndex(d => d[key] === val);
    if (idx === -1) throw Object.assign(new Error('Not found'), { code: 'P2025' });
    this.data.splice(idx, 1);
  }

  count({ where }: { where: any }): number {
    if (!where || Object.keys(where).length === 0) return this.data.length;
    return this.data.filter(item => Object.entries(where).every(([k, v]) => item[k] === v)).length;
  }
}
