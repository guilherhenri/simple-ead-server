import { Either, left, right } from '@/core/either'
import { ClassesRepository } from '@/repositories/classes-repository'
import { ComplementaryMaterialsRepository } from '@/repositories/complementary-materials-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface AddComplementaryMaterialsToClassUseCaseRequest {
  filename: string
  classId: string
}

type AddComplementaryMaterialsToClassUseCaseResponse = Either<
  ResourceNotFoundError,
  {}
>

export class AddComplementaryMaterialsToClassUseCase {
  constructor(
    private complementaryMaterialsRepository: ComplementaryMaterialsRepository,
    private classesRepository: ClassesRepository,
  ) {}

  async execute({
    filename,
    classId,
  }: AddComplementaryMaterialsToClassUseCaseRequest): Promise<AddComplementaryMaterialsToClassUseCaseResponse> {
    const lesson = await this.classesRepository.findById(classId)

    if (!lesson) {
      return left(new ResourceNotFoundError())
    }

    await this.complementaryMaterialsRepository.create({
      filename,
      class_id: classId,
    })

    return right({})
  }
}
