import { Either, left, right } from '@/core/either'
import { Class } from '@prisma/client'

import { ClassModulesRepository } from '@/repositories/class-modules-repository'
import { ClassesRepository } from '@/repositories/classes-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface FectchClassModuleClassesUseCaseRequest {
  classModuleId: string
}

type FectchClassModuleClassesUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    classes: Class[]
  }
>

export class FectchClassModuleClassesUseCase {
  constructor(
    private classesRepository: ClassesRepository,
    private classModulesRepository: ClassModulesRepository,
  ) {}

  async execute({
    classModuleId,
  }: FectchClassModuleClassesUseCaseRequest): Promise<FectchClassModuleClassesUseCaseResponse> {
    const classModule =
      await this.classModulesRepository.findById(classModuleId)

    if (!classModule) {
      return left(new ResourceNotFoundError())
    }

    const classes =
      await this.classesRepository.fetchManyByClassModuleId(classModuleId)

    return right({
      classes,
    })
  }
}
