import { InMemoryClassModulesRepository } from 'test/repositories/in-memory-class-modules-repository'
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository'
import { FetchCourseClassModulesUseCase } from './fetch-course-class-modules'
import { makeCourse } from 'test/factories/make-course'
import { makeClassModule } from 'test/factories/make-class-module'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let classModulesRepository: InMemoryClassModulesRepository
let coursesRepository: InMemoryCoursesRepository
let sut: FetchCourseClassModulesUseCase

describe('Fetch Course Class Modules Use Case', () => {
  beforeEach(() => {
    classModulesRepository = new InMemoryClassModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    sut = new FetchCourseClassModulesUseCase(
      classModulesRepository,
      coursesRepository,
    )
  })

  it('should be able to fecth class modules of a course', async () => {
    const course = await makeCourse({}, coursesRepository)
    await makeClassModule(
      { title: 'module 3', course_id: course.id, order: 3 },
      classModulesRepository,
    )
    await makeClassModule(
      { title: 'module 1', course_id: course.id, order: 1 },
      classModulesRepository,
    )
    await makeClassModule(
      { title: 'module 2', course_id: course.id, order: 2 },
      classModulesRepository,
    )

    const result = await sut.execute({
      courseId: course.id,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.classModules).toHaveLength(3)
      expect(result.value.classModules).toEqual([
        expect.objectContaining({
          title: 'module 1',
        }),
        expect.objectContaining({
          title: 'module 2',
        }),
        expect.objectContaining({
          title: 'module 3',
        }),
      ])
    }
  })

  it('should not be able to fecth class modules of a course does not exists', async () => {
    const result = await sut.execute({
      courseId: 'course-id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
