import { InMemoryClassModulesRepository } from 'test/repositories/in-memory-class-modules-repository'
import { InMemoryClassesRepository } from 'test/repositories/in-memory-classes-repository'
import { FectchClassModuleClassesUseCase } from './fetch-class-module-classes'
import { makeClass } from 'test/factories/make-class'
import { makeClassModule } from 'test/factories/make-class-module'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let classesRepository: InMemoryClassesRepository
let classModulesRepository: InMemoryClassModulesRepository
let sut: FectchClassModuleClassesUseCase

describe('Fetch Class Module Clasess Use Case', () => {
  beforeEach(() => {
    classesRepository = new InMemoryClassesRepository()
    classModulesRepository = new InMemoryClassModulesRepository()
    sut = new FectchClassModuleClassesUseCase(
      classesRepository,
      classModulesRepository,
    )
  })

  it('should be able to fecth classes of a class module', async () => {
    const classModule = await makeClassModule({}, classModulesRepository)
    await makeClass(
      {
        title: 'class 3',
        order: 3,
        class_module_id: classModule.id,
      },
      classesRepository,
    )
    await makeClass(
      {
        title: 'class 1',
        order: 1,
        class_module_id: classModule.id,
      },
      classesRepository,
    )
    await makeClass(
      {
        title: 'class 2',
        order: 2,
        class_module_id: classModule.id,
      },
      classesRepository,
    )

    const result = await sut.execute({
      classModuleId: classModule.id,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.classes).toHaveLength(3)
      expect(result.value.classes).toEqual([
        expect.objectContaining({
          title: 'class 1',
        }),
        expect.objectContaining({
          title: 'class 2',
        }),
        expect.objectContaining({
          title: 'class 3',
        }),
      ])
    }
  })

  it('should not be able to fecth classes of a class module does not exists', async () => {
    const result = await sut.execute({
      classModuleId: 'course-id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
