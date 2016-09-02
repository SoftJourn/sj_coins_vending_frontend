export interface IAppError {
  code: string,
  message: string
}

export class AppError implements IAppError {

  constructor(
    public code: string = '',
    public message: string = ''
  ) {}
}
