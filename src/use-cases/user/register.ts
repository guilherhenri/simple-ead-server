import { Role, User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { UsersRepository } from '@/repositories/users-repository'
import { Either, left, right } from '@/core/either'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use-error'

interface RegisterUserCaseRequest {
  name: string
  email: string
  password: string
  cpf?: string
  role: Role
}

type RegisterUserCaseResponse = Either<
  EmailAlreadyInUseError,
  {
    user: User
  }
>

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
      return left(new EmailAlreadyInUseError())
    }

    const passwordHashed = await hash(password, 8)

    const user = await this.userRepository.create({
      name,
      email,
      password_hash: passwordHashed,
      cpf,
      role,
    })

    return right({
      user,
    })
  }
}
