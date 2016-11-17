import { ErrorHandler } from "@angular/core";

export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.log((<any> this).constructor.name);
    console.log(error);
  }
}
