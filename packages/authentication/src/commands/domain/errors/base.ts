import { CustomError } from '../../../shared/domain/errors'

export class DomainError extends CustomError {
  private readonly __tag = 'DomainError'

  constructor(name: string, message: string) {
    super(name, message)
  }
}