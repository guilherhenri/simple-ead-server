import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository'
import { makeCourse } from './make-course'

let coursesRepository: InMemoryCoursesRepository

describe('Make Course Factory', () => {
  beforeEach(() => {
    coursesRepository = new InMemoryCoursesRepository()
  })

  it('should be able to create a course', async () => {
    const course = await makeCourse({}, coursesRepository)

    expect(course.id).toBeTruthy()
    expect(coursesRepository.courses).toHaveLength(1)
  })

  it('should be able to create a course with custom infos', async () => {
    const course = await makeCourse(
      {
        title: 'test',
        description: 'test',
      },
      coursesRepository,
    )

    expect(course).toEqual(
      expect.objectContaining({
        title: 'test',
        description: 'test',
      }),
    )
  })
})
