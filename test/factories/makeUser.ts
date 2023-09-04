import { Prisma, User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { UsersRepository } from '@/repositories/users-repository'

export async function makeUser(
  override: Partial<Prisma.UserCreateInput> = {},
  usersRepository: UsersRepository,
): Promise<User> {
  const user = await usersRepository.create({
    name: 'John Doe',
    email: 'johndoe@email.com',
    password_hash: await hash('123456', 8),
    ...override,
  })

  return user
}
