import { InMemoryClassModulesRepository } from 'test/repositories/in-memory-class-modules-repository'
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryClassesRepository } from 'test/repositories/in-memory-classes-repository'
import { CreateClassUseCase } from './create-class'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ResourceAlreadyInUseError } from '../errors/resource-already-in-use-error'
import { makeClassModule } from 'test/factories/make-class-module'
import { makeCourse } from 'test/factories/make-course'
import { makeUser } from 'test/factories/make-user'

let classesRepository: InMemoryClassesRepository
let classModulesRepository: InMemoryClassModulesRepository
let coursesRepository: InMemoryCoursesRepository
let usersRepository: InMemoryUsersRepository
let sut: CreateClassUseCase

describe('Create Class Module Use Case', () => {
  beforeEach(() => {
    classesRepository = new InMemoryClassesRepository()
    classModulesRepository = new InMemoryClassModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new CreateClassUseCase(classesRepository, classModulesRepository)
  })

  it('should be able to create a class', async () => {
    const producer = await makeUser({ role: 'producer' }, usersRepository)
    const course = await makeCourse({}, coursesRepository, producer.id)
    const classModule = await makeClassModule(
      {},
      classModulesRepository,
      course.id,
    )

    const result = await sut.execute({
      title: 'class title',
      description: 'class description',
      classModuleId: classModule.id,
      videoEmbed: '<iframe>a</iframe>',
    })

    expect(result.isRight()).toBeTruthy()
  })

  it('should not be able to create a class module with same title twice in same class module', async () => {
    const producer = await makeUser({ role: 'producer' }, usersRepository)
    const course = await makeCourse({}, coursesRepository, producer.id)
    const classModule = await makeClassModule(
      {},
      classModulesRepository,
      course.id,
    )

    await sut.execute({
      title: 'class title',
      description: 'class description',
      classModuleId: classModule.id,
      videoEmbed: '<iframe>a</iframe>',
    })

    const result = await sut.execute({
      title: 'class title',
      description: 'class description',
      classModuleId: classModule.id,
      videoEmbed: '<iframe>a</iframe>',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceAlreadyInUseError)
    expect(classesRepository.classes).toHaveLength(1)
  })

  it('should not be able to create a class with same slug twice', async () => {
    const producer = await makeUser({ role: 'producer' }, usersRepository)
    const course = await makeCourse({}, coursesRepository, producer.id)
    const classModule1 = await makeClassModule(
      { title: 'module-01' },
      classModulesRepository,
      course.id,
    )
    const classModule2 = await makeClassModule(
      { title: 'module-02' },
      classModulesRepository,
      course.id,
    )

    await sut.execute({
      title: 'class title',
      description: 'class description',
      classModuleId: classModule1.id,
      videoEmbed: '<iframe>a</iframe>',
    })

    const result = await sut.execute({
      title: 'class title',
      description: 'class description',
      classModuleId: classModule2.id,
      videoEmbed: '<iframe>a</iframe>',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceAlreadyInUseError)
    expect(classesRepository.classes).toHaveLength(1)
  })

  it('should not be able to create a class module for a class module does not exists', async () => {
    const result = await sut.execute({
      title: 'class title',
      description: 'class description',
      classModuleId: 'module-id',
      videoEmbed: '<iframe>a</iframe>',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(classesRepository.classes).toHaveLength(0)
  })
})
