import { cpfValidation } from './cpf-validation'

describe('CPF Validation', () => {
  it('should be able to validate a cpf', () => {
    const cpf = '773.698.830-78'

    const result = cpfValidation(cpf)

    expect(result).toBeTruthy()
  })

  it('should not be able to validate an invalid cpf', () => {
    const cpf = '111.111.111-11'

    const result = cpfValidation(cpf)

    expect(result).toBe(false)
  })
})
