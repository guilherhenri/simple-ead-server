import { ControllerError } from '@/core/errors/controller-error'

export class DefaultError extends ControllerError {
  constructor(error: Error) {
    super(error, 500, 'Internal server error.')
  }
}
