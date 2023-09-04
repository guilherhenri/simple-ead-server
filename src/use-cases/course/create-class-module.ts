import { ClassModule } from '@prisma/client'

import { Either, left, right } from '@/core/either'
import { ClassModulesRepository } from '@/repositories/class-modules-repository'
import { CoursesRepository } from '@/repositories/courses-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed'
import { ResourceAlreadyInUseError } from '../errors/resource-already-in-use-error'

interface CreateClassModuleUseCaseRequest {
  title: string
  description: string
  order: number
  courseId: string
  producerId: string
}

type CreateClassModuleUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | ResourceAlreadyInUseError,
  { classModule: ClassModule }
>

export class CreateClassModuleUseCase {
  constructor(
    private classModulesRepository: ClassModulesRepository,
    private coursesRepository: CoursesRepository,
  ) {}

  async execute({
    title,
    description,
    order,
    courseId,
    producerId,
  }: CreateClassModuleUseCaseRequest): Promise<CreateClassModuleUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    if (course.producer_id !== producerId) {
      return left(new NotAllowedError())
    }

    const classModuleWithSameTitle =
      await this.classModulesRepository.findByTitle(title)

    if (classModuleWithSameTitle) {
      return left(new ResourceAlreadyInUseError())
    }

    const classModule = await this.classModulesRepository.create({
      title,
      description,
      order,
      course_id: courseId,
    })

    return right({
      classModule,
    })
  }
}
