import { InMemoryClassModulesRepository } from 'test/repositories/in-memory-class-modules-repository'
import { InMemoryClassesRepository } from 'test/repositories/in-memory-classes-repository'
import { CreateClassUseCase } from './create-class'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ResourceAlreadyInUseError } from '../errors/resource-already-in-use-error'
import { makeClassModule } from 'test/factories/make-class-module'

let classesRepository: InMemoryClassesRepository
let classModulesRepository: InMemoryClassModulesRepository
let sut: CreateClassUseCase

describe('Create Class Module Use Case', () => {
  beforeEach(() => {
    classesRepository = new InMemoryClassesRepository()
    classModulesRepository = new InMemoryClassModulesRepository()

    sut = new CreateClassUseCase(classesRepository, classModulesRepository)
  })

  it('should be able to create a class', async () => {
    const classModule = await makeClassModule({}, classModulesRepository)

    const result = await sut.execute({
      title: 'class title',
      description: 'class description',
      classModuleId: classModule.id,
      videoEmbed: '<iframe>a</iframe>',
    })

    expect(result.isRight()).toBeTruthy()
  })

  it('should not be able to create a class module with same title twice in same class module', async () => {
    const classModule = await makeClassModule({}, classModulesRepository)

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
    const classModule1 = await makeClassModule(
      { title: 'module-01' },
      classModulesRepository,
    )
    const classModule2 = await makeClassModule(
      { title: 'module-02' },
      classModulesRepository,
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
