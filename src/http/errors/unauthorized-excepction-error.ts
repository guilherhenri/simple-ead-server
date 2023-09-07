import { ControllerError } from '@/core/errors/controller-error'

export class UnauthorizedExceptionError extends ControllerError {
  constructor(error: Error) {
    super(error, 409)
  }
}
