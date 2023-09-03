import { Role, User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { UsersRepository } from '@/repositories/users-repository'

interface RegisterUserCaseRequest {
  name: string
  email: string
  password: string
  cpf?: string
  role: Role
}

interface RegisterUserCaseResponse {
  user: User
}

export class RegisterUserCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    cpf,
    role,
  }: RegisterUserCaseRequest): Promise<RegisterUserCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('E-mail already in use')
    }

    const passwordHash = await hash(password, 8)

    const user = await this.userRepository.create({
      name,
      email,
      password_hash: passwordHash,
      cpf,
      role,
    })

    return {
      user,
    }
  }
}
