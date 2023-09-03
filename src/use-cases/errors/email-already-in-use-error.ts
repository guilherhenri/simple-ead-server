import { UseCaseError } from '@/core/errors/use-case-error'

export class EmailAlreadyInUseError extends Error implements UseCaseError {
  constructor() {
    super('E-mail already in use.')
  }
}
