import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from './make-user'

let usersRepository: InMemoryUsersRepository

describe('Make User Factory', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
  })

  it('should be able to create an user', async () => {
    const user = await makeUser({}, usersRepository)

    expect(user.id).toBeTruthy()
    expect(usersRepository.users).toHaveLength(1)
  })

  it('should be able to create an user with custom infos', async () => {
    const user = await makeUser(
      {
        name: 'test',
        email: 'test@email.com',
        role: 'producer',
      },
      usersRepository,
    )

    expect(user).toEqual(
      expect.objectContaining({
        name: 'test',
        email: 'test@email.com',
        role: 'producer',
      }),
    )
  })
})
