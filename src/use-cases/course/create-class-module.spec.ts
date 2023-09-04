import { InMemoryClassModulesRepository } from 'test/repositories/in-memory-class-modules-repository'
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository'
import { CreateClassModuleUseCase } from './create-class-module'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeCourse } from 'test/factories/make-course'
import { ResourceAlreadyInUseError } from '../errors/resource-already-in-use-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed'

let classModulesRepository: InMemoryClassModulesRepository
let coursesRepository: InMemoryCoursesRepository
let usersRepository: InMemoryUsersRepository
let sut: CreateClassModuleUseCase

describe('Create Class Module Use Case', () => {
  beforeEach(() => {
    classModulesRepository = new InMemoryClassModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new CreateClassModuleUseCase(
      classModulesRepository,
      coursesRepository,
    )
  })

  it('should be able to create a class module', async () => {
    const producer = await makeUser({ role: 'producer' }, usersRepository)
    const course = await makeCourse({}, coursesRepository, producer.id)

    const result = await sut.execute({
      title: 'module title',
      description: 'module description',
      order: 1,
      courseId: course.id,
      producerId: producer.id,
    })

    expect(result.isRight()).toBeTruthy()
  })

  it('should not be able to create a class module with same title twice', async () => {
    const producer = await makeUser({ role: 'producer' }, usersRepository)
    const course = await makeCourse({}, coursesRepository, producer.id)

    await sut.execute({
      title: 'module title',
      description: 'module description',
      order: 1,
      courseId: course.id,
      producerId: producer.id,
    })

    const result = await sut.execute({
      title: 'module title',
      description: 'module description',
      order: 1,
      courseId: course.id,
      producerId: producer.id,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceAlreadyInUseError)
  })

  it('should not be able to create a class module for a course does not exists', async () => {
    const producer = await makeUser({ role: 'producer' }, usersRepository)

    const result = await sut.execute({
      title: 'module title',
      description: 'module description',
      order: 1,
      courseId: 'course-id',
      producerId: producer.id,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be possible to create a class module for a course where the user is not the producer', async () => {
    const producer = await makeUser({ role: 'producer' }, usersRepository)
    const user = await makeUser({ role: 'producer' }, usersRepository)
    const course = await makeCourse({}, coursesRepository, producer.id)

    const result = await sut.execute({
      title: 'module title',
      description: 'module description',
      order: 1,
      courseId: course.id,
      producerId: user.id,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
