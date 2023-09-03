import { UseCaseError } from '@/core/errors/use-case-error'

export class ResourceAlreadyInUseError extends Error implements UseCaseError {
  constructor() {
    super('Resource already in use.')
  }
}
