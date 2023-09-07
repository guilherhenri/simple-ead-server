import { InMemoryClassesRepository } from 'test/repositories/in-memory-classes-repository'
import { InMemoryComplementaryMaterialsRepository } from 'test/repositories/in-memory-complementary-materials-repository'
import { AddComplementaryMaterialsToClassUseCase } from './add-complementary-materials-to-class'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { makeClass } from 'test/factories/make-class'

let complementaryMaterialsRepository: InMemoryComplementaryMaterialsRepository
let classesRepository: InMemoryClassesRepository
let sut: AddComplementaryMaterialsToClassUseCase

describe('Add Complementary Material Use Case', () => {
  beforeEach(() => {
    complementaryMaterialsRepository =
      new InMemoryComplementaryMaterialsRepository()
    classesRepository = new InMemoryClassesRepository()

    sut = new AddComplementaryMaterialsToClassUseCase(
      complementaryMaterialsRepository,
      classesRepository,
    )
  })

  it('should be able to add a complementary material to class', async () => {
    const lesson = await makeClass({}, classesRepository)

    const filename = 'test.txt'

    const result = await sut.execute({
      filename,
      classId: lesson.id,
    })

    expect(result.isRight()).toBeTruthy()
    expect(complementaryMaterialsRepository.materials).toHaveLength(1)
  })

  it('should not be able to add a complementary material to class does not exists', async () => {
    const filename = 'test.txt'

    const result = await sut.execute({
      filename,
      classId: 'class-id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(complementaryMaterialsRepository.materials).toHaveLength(0)
  })
})
