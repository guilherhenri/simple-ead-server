import { Class } from '@prisma/client'

import { Either, left, right } from '@/core/either'
import { ClassModulesRepository } from '@/repositories/class-modules-repository'
import { ClassesRepository } from '@/repositories/classes-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ResourceAlreadyInUseError } from '../errors/resource-already-in-use-error'
import { generateSlug } from '@/utils/generate-slug'

interface CreateClassUseCaseRequest {
  title: string
  description: string
  videoEmbed: string
  classModuleId: string
}

type CreateClassUseCaseResponse = Either<
  ResourceNotFoundError | ResourceAlreadyInUseError,
  {
    lesson: Class
  }
>

export class CreateClassUseCase {
  constructor(
    private classesRepository: ClassesRepository,
    private classModulesRepository: ClassModulesRepository,
  ) {}

  async execute({
    title,
    description,
    videoEmbed,
    classModuleId,
  }: CreateClassUseCaseRequest): Promise<CreateClassUseCaseResponse> {
    const classModule =
      await this.classModulesRepository.findById(classModuleId)

    if (!classModule) {
      return left(new ResourceNotFoundError())
    }

    const classWithSameTitleInSameClassModule =
      await this.classesRepository.findByTitleAndClassModuleId(
        title,
        classModuleId,
      )

    if (classWithSameTitleInSameClassModule) {
      return left(new ResourceAlreadyInUseError())
    }

    const slug = generateSlug(title)

    const classWithSameSlug = await this.classesRepository.findBySlug(slug)

    if (classWithSameSlug) {
      return left(new ResourceAlreadyInUseError())
    }

    const lesson = await this.classesRepository.create({
      title,
      description,
      video_embed: videoEmbed,
      class_module_id: classModuleId,
      slug,
    })

    return right({
      lesson,
    })
  }
}
