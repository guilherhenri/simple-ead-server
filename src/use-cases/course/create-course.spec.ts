import { hash } from 'bcryptjs'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateCourseUseCase } from './create-course'
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository'
import { ResourceAlreadyInUseError } from '../errors/resource-already-in-use-error'
import { NotAllowedError } from '../errors/not-allowed'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let coursesRepository: InMemoryCoursesRepository
let usersRepository: InMemoryUsersRepository
let sut: CreateCourseUseCase

describe('Create Course Use Case', () => {
  beforeEach(() => {
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateCourseUseCase(coursesRepository, usersRepository)
  })

  it('should be able to create a course', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
      role: 'productor',
    })

    const result = await sut.execute({
      title: 'Course example',
      description: 'Just a test',
      accessTime: 90,
      subjects: ['javascript', 'typescript'],
      productorId: user.id,
    })

    expect(result.isRight()).toBeTruthy()
    expect(coursesRepository.courses).toHaveLength(1)
  })

  it('should not be able to create a course with same title twice', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
      role: 'productor',
    })

    await sut.execute({
      title: 'Course example',
      description: 'Just a test',
      accessTime: 90,
      subjects: ['javascript', 'typescript'],
      productorId: user.id,
    })

    const result = await sut.execute({
      title: 'Course example',
      description: 'Just a test',
      accessTime: 90,
      subjects: ['javascript', 'typescript'],
      productorId: user.id,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceAlreadyInUseError)
  })

  it('should not be able to create a course with same slug twice', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
      role: 'productor',
    })

    await sut.execute({
      title: 'Course example',
      description: 'Just a test',
      accessTime: 90,
      subjects: ['javascript', 'typescript'],
      productorId: user.id,
    })

    const result = await sut.execute({
      title: 'Course example-',
      description: 'Just a test',
      accessTime: 90,
      subjects: ['javascript', 'typescript'],
      productorId: user.id,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceAlreadyInUseError)
  })

  it('should not be able to create a course if the user is not exists', async () => {
    const result = await sut.execute({
      title: 'Course example',
      description: 'Just a test',
      accessTime: 90,
      subjects: ['javascript', 'typescript'],
      productorId: 'id-test',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a course if the user is not a productor', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
      role: 'admin',
    })

    const result = await sut.execute({
      title: 'Course example',
      description: 'Just a test',
      accessTime: 90,
      subjects: ['javascript', 'typescript'],
      productorId: user.id,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
