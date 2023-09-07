export abstract class ControllerError {
  customError: Error
  statusCode: number
  message: string

  constructor(error: Error, statusCode: number, message?: string) {
    this.customError = error
    this.statusCode = statusCode
    this.message = message ?? error.message
  }
}
