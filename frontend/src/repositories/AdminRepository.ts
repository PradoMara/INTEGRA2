import { api } from '../lib/api';
import type { BackendUser } from '../types/User';

export class AdminRepository {
  async getUsers(): Promise<BackendUser[]> {
    const response = await api.get<{ total: number; users: BackendUser[] }>('/api/admin/users');
    return response.users;
  }

  async banUser(userId: number, banned: boolean): Promise<any> {
    return api.patch(`/api/admin/users/${userId}/ban`, { banned });
  }

  async deleteUser(userId: number): Promise<any> {
    return api.delete(`/api/admin/users/${userId}`);
  }
}