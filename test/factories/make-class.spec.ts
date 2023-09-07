import { InMemoryClassesRepository } from 'test/repositories/in-memory-classes-repository'
import { makeClass } from './make-class'

let classesRepository: InMemoryClassesRepository

describe('Make Class Factory', () => {
  beforeEach(() => {
    classesRepository = new InMemoryClassesRepository()
  })

  it('should be able to create a class', async () => {
    const lesson = await makeClass({}, classesRepository)

    expect(lesson.id).toBeTruthy()
    expect(classesRepository.classes).toHaveLength(1)
  })

  it('should be able to create a class with custom infos', async () => {
    const lesson = await makeClass(
      {
        title: 'test',
        description: 'test',
      },
      classesRepository,
    )

    expect(lesson).toEqual(
      expect.objectContaining({
        title: 'test',
        description: 'test',
      }),
    )
  })
})
