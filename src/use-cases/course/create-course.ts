import { Course } from '@prisma/client'

import { Either, left, right } from '@/core/either'
import { CoursesRepository } from '@/repositories/courses-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed'
import { ResourceAlreadyInUseError } from '../errors/resource-already-in-use-error'
import { generateSlug } from '@/utils/generate-slug'

interface CreateCourseUseCaseRequest {
  title: string
  description: string
  accessTime: number
  subjects: string[]
  productorId: string
}

type CreateCourseUseCaseResponse = Either<
  ResourceNotFoundError | ResourceAlreadyInUseError | NotAllowedError,
  {
    course: Course
  }
>

export class CreateCourseUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    title,
    description,
    accessTime,
    subjects,
    productorId,
  }: CreateCourseUseCaseRequest): Promise<CreateCourseUseCaseResponse> {
    const userIsProductor = await this.usersRepository.findById(productorId)

    if (!userIsProductor) {
      return left(new ResourceNotFoundError())
    }

    if (userIsProductor.role !== 'productor') {
      return left(new NotAllowedError())
    }

    const courseWithSameTitle = await this.coursesRepository.findByTitle(title)

    if (courseWithSameTitle) {
      return left(new ResourceAlreadyInUseError())
    }

    const slug = generateSlug(title)

    const courseWithSameSlug = await this.coursesRepository.findBySlug(slug)

    if (courseWithSameSlug) {
      return left(new ResourceAlreadyInUseError())
    }

    const course = await this.coursesRepository.create({
      title,
      description,
      slug,
      access_time: accessTime,
      subjects,
      productor_id: productorId,
    })

    return right({
      course,
    })
  }
}
