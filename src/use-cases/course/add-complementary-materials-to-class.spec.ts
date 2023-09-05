import fs from 'node:fs'
import { InMemoryClassesRepository } from 'test/repositories/in-memory-classes-repository'
import { InMemoryComplementaryMaterialsRepository } from 'test/repositories/in-memory-complementary-materials-repository'
import { AddComplementaryMaterialsToClassUseCase } from './add-complementary-materials-to-class'
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository'
import { InMemoryClassModulesRepository } from 'test/repositories/in-memory-class-modules-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { makeCourse } from 'test/factories/make-course'
import { makeClassModule } from 'test/factories/make-class-module'
import { makeClass } from 'test/factories/make-class'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let complementaryMaterialsRepository: InMemoryComplementaryMaterialsRepository
let classesRepository: InMemoryClassesRepository
let classModulesRepository: InMemoryClassModulesRepository
let coursesRepository: InMemoryCoursesRepository
let usersRepository: InMemoryUsersRepository
let sut: AddComplementaryMaterialsToClassUseCase

describe('Upload File', () => {
  beforeEach(() => {
    const content = 'Test'
    fs.writeFileSync('test.txt', content)

    complementaryMaterialsRepository =
      new InMemoryComplementaryMaterialsRepository()
    classesRepository = new InMemoryClassesRepository()
    classModulesRepository = new InMemoryClassModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new AddComplementaryMaterialsToClassUseCase(
      complementaryMaterialsRepository,
      classesRepository,
    )
  })

  afterEach(() => {
    fs.unlinkSync('test.txt')
  })

  it('should be able to add a complementary material to class', async () => {
    const producer = await makeUser({ role: 'producer' }, usersRepository)
    const course = await makeCourse({}, coursesRepository, producer.id)
    const classModule = await makeClassModule(
      {},
      classModulesRepository,
      course.id,
    )
    const lesson = await makeClass({}, classesRepository, classModule.id)

    const file = fs.readFileSync('test.txt').toString()
    const filename = 'test.txt'

    const result = await sut.execute({
      part: {
        file,
        filename,
      },
      classId: lesson.id,
    })

    expect(result.isRight()).toBeTruthy()
    expect(complementaryMaterialsRepository.materials).toHaveLength(1)
    expect(
      fs.existsSync(
        `tmp/materials/${complementaryMaterialsRepository.materials[0].filename}`,
      ),
    ).toBeTruthy()

    fs.unlinkSync(
      `tmp/materials/${complementaryMaterialsRepository.materials[0].filename}`,
    )
  })

  it('should not be able to add a complementary material to class does not exists', async () => {
    const file = fs.readFileSync('test.txt').toString()
    const filename = 'test.txt'

    const result = await sut.execute({
      part: {
        file,
        filename,
      },
      classId: 'class-id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(complementaryMaterialsRepository.materials).toHaveLength(0)
  })
})
