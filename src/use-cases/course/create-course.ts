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
  producerId: string
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
    producerId,
  }: CreateCourseUseCaseRequest): Promise<CreateCourseUseCaseResponse> {
    const userIsProducer = await this.usersRepository.findById(producerId)

    if (!userIsProducer) {
      return left(new ResourceNotFoundError())
    }

    if (userIsProducer.role !== 'producer') {
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
      producer_id: producerId,
    })

    return right({
      course,
    })
  }
}
