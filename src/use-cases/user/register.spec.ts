import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { RegisterUserCase } from './register'
import { compare } from 'bcryptjs'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUserCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserCase(usersRepository)
  })

  it('should be able to register', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
      role: 'student',
    })

    expect(result.isRight).toBeTruthy()
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
      role: 'student',
    })

    if (result.isRight()) {
      const { user } = result.value

      const isPasswordCorrectlyHashed = await compare(
        '123456',
        user.password_hash,
      )

      expect(isPasswordCorrectlyHashed).toBe(true)
    }
  })

  it('should not be able to register with same email twice', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: '123456',
      role: 'student',
    })

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
      role: 'student',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(EmailAlreadyInUseError)
  })
})
