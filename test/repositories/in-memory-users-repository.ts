import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'

import { UsersRepository } from '@/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      cpf: data.cpf ?? null,
      role: data.role ?? 'student',
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
