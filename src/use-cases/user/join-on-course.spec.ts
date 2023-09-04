import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository'
import { InMemoryCourseUsersRepository } from 'test/repositories/in-memory-course-users-repository'
import { JoinOnCourseUseCase } from './join-on-course'
import { makeUser } from 'test/factories/make-user'
import { makeCourse } from 'test/factories/make-course'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed'

let coursesRepository: InMemoryCoursesRepository
let usersRepository: InMemoryUsersRepository
let courseUsersRepository: InMemoryCourseUsersRepository
let sut: JoinOnCourseUseCase

describe('Join On Course Use Case', () => {
  beforeEach(() => {
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    courseUsersRepository = new InMemoryCourseUsersRepository()

    sut = new JoinOnCourseUseCase(
      coursesRepository,
      usersRepository,
      courseUsersRepository,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to join on course', async () => {
    const producer = await makeUser({ role: 'producer' }, usersRepository)
    const course = await makeCourse({}, coursesRepository, producer.id)
    const student = await makeUser({}, usersRepository)

    const result = await sut.execute({
      studentId: student.id,
      courseId: course.id,
    })

    expect(result.isRight()).toBeTruthy()
  })

  it('should not be able to join on course with a user that does not exist', async () => {
    const producer = await makeUser({ role: 'producer' }, usersRepository)
    const course = await makeCourse({}, coursesRepository, producer.id)

    const result = await sut.execute({
      studentId: 'student-id',
      courseId: course.id,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to join on course that does not exist', async () => {
    const student = await makeUser({}, usersRepository)

    const result = await sut.execute({
      studentId: student.id,
      courseId: 'course-id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to join on course with a non-student user', async () => {
    const producer = await makeUser({ role: 'producer' }, usersRepository)
    const course = await makeCourse({}, coursesRepository, producer.id)

    const result = await sut.execute({
      studentId: producer.id,
      courseId: course.id,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('must be possible to update the access expires date when the user is already in the course', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0))

    const producer = await makeUser({ role: 'producer' }, usersRepository)
    const course = await makeCourse({}, coursesRepository, producer.id)
    const student = await makeUser({}, usersRepository)

    await sut.execute({
      studentId: student.id,
      courseId: course.id,
    })

    const oldAccessExpires =
      courseUsersRepository.courseUsers[0].access_expires_in

    vi.setSystemTime(new Date(2023, 0, 2, 12, 0))

    const result = await sut.execute({
      studentId: student.id,
      courseId: course.id,
    })

    const newAccessExpires =
      courseUsersRepository.courseUsers[0].access_expires_in

    expect(result.isRight()).toBeTruthy()
    expect(oldAccessExpires).not.toEqual(newAccessExpires)
    expect(courseUsersRepository.courseUsers).toHaveLength(1)
  })
})
