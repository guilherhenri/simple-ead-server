import { Either, left, right } from '@/core/either'
import { ClassesRepository } from '@/repositories/classes-repository'
import { ComplementaryMaterialsRepository } from '@/repositories/complementary-materials-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { uploadFile } from '@/utils/upload-file'
import { MultipartFile } from '@fastify/multipart'
import { UploadFileError } from '../errors/upload-file-error'

interface AddComplementaryMaterialsToClassUseCaseRequest {
  part: MultipartFile
  classId: string
}

type AddComplementaryMaterialsToClassUseCaseResponse = Either<
  ResourceNotFoundError | UploadFileError,
  {}
>

export class AddComplementaryMaterialsToClassUseCase {
  constructor(
    private complementaryMaterialsRepository: ComplementaryMaterialsRepository,
    private classesRepository: ClassesRepository,
  ) {}

  async execute({
    part,
    classId,
  }: AddComplementaryMaterialsToClassUseCaseRequest): Promise<AddComplementaryMaterialsToClassUseCaseResponse> {
    const lesson = await this.classesRepository.findById(classId)

    if (!lesson) {
      return left(new ResourceNotFoundError())
    }

    const result = await uploadFile(part, 'materials')

    if (result.isLeft()) {
      return left(new UploadFileError())
    }

    const { filename } = result.value

    await this.complementaryMaterialsRepository.create({
      filename,
      class_id: classId,
    })

    return right({})
  }
}
