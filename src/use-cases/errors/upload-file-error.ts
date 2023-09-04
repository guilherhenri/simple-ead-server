import { UseCaseError } from '@/core/errors/use-case-error'

export class UploadFileError extends Error implements UseCaseError {
  constructor() {
    super('Error saving file.')
  }
}
