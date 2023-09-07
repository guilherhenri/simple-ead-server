import { InMemoryClassModulesRepository } from 'test/repositories/in-memory-class-modules-repository'
import { makeClassModule } from './make-class-module'

let classModulesRepository: InMemoryClassModulesRepository

describe('Make User Factory', () => {
  beforeEach(() => {
    classModulesRepository = new InMemoryClassModulesRepository()
  })

  it('should be able to create an user', async () => {
    const classModule = await makeClassModule({}, classModulesRepository)

    expect(classModule.id).toBeTruthy()
    expect(classModulesRepository.classModules).toHaveLength(1)
  })

  it('should be able to create an user with custom infos', async () => {
    const classModule = await makeClassModule(
      {
        title: 'test',
        description: 'test',
      },
      classModulesRepository,
    )

    expect(classModule).toEqual(
      expect.objectContaining({
        title: 'test',
        description: 'test',
      }),
    )
  })
})
