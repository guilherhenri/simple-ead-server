import { Either, left, right } from '@/core/either'
import { ClassModulesRepository } from '@/repositories/class-modules-repository'
import { CoursesRepository } from '@/repositories/courses-repository'
import { ClassModule } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface FetchCourseClassModulesUseCaseRequest {
  courseId: string
}

type FetchCourseClassModulesUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    classModules: ClassModule[]
  }
>

export class FetchCourseClassModulesUseCase {
  constructor(
    private classModulesRepository: ClassModulesRepository,
    private coursesRepository: CoursesRepository,
  ) {}

  async execute({
    courseId,
  }: FetchCourseClassModulesUseCaseRequest): Promise<FetchCourseClassModulesUseCaseResponse> {
    const courseExists = await this.coursesRepository.findById(courseId)

    if (!courseExists) {
      return left(new ResourceNotFoundError())
    }

    const classModules =
      await this.classModulesRepository.fetchManyByCourseId(courseId)

    return right({
      classModules,
    })
  }
}
