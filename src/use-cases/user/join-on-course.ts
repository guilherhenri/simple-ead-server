import dayjs from 'dayjs'

import { Either, left, right } from '@/core/either'
import { CoursesRepository } from '@/repositories/courses-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { CourseUsersRepository } from '@/repositories/course-users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed'

interface JoinOnCourseUseCaseRequest {
  studentId: string
  courseId: string
}

type JoinOnCourseUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class JoinOnCourseUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private userRepository: UsersRepository,
    private courseUsersRepository: CourseUsersRepository,
  ) {}

  async execute({
    studentId,
    courseId,
  }: JoinOnCourseUseCaseRequest): Promise<JoinOnCourseUseCaseResponse> {
    const userIsStudent = await this.userRepository.findById(studentId)

    if (!userIsStudent) {
      return left(new ResourceNotFoundError())
    }

    if (userIsStudent.role !== 'student') {
      return left(new NotAllowedError())
    }

    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const accessExpiresIn = dayjs().add(course.access_time, 'day').toDate()

    const userAlreadyInCourse =
      await this.courseUsersRepository.findByStudentIdAndCourseId(
        studentId,
        courseId,
      )

    if (userAlreadyInCourse) {
      await this.courseUsersRepository.updateAccessTime(
        userAlreadyInCourse.id,
        accessExpiresIn,
      )
    } else {
      await this.courseUsersRepository.create({
        access_expires_in: accessExpiresIn,
        student_id: studentId,
        course_id: courseId,
      })
    }

    return right({})
  }
}
