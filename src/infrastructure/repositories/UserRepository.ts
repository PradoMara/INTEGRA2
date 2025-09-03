import type { IUserRepository, Credentials } from '../../domain/usecases/LoginUser'
import type { User } from '../../domain/entities/User'
import * as api from '../api/authApi'

export class UserRepository implements IUserRepository {
  async login(credentials: Credentials): Promise<User> {
    return api.login(credentials)
  }
}
