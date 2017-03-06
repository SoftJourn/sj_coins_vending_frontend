import {NotificationsService} from "angular2-notifications";
import {ErrorDetail} from "./entity/error-detail";
import {Injectable} from "@angular/core";

@Injectable()
export class NotificationsManager {

  //Notification titles
  static createTitle = 'Create';
  static errorTitle = 'Error';

  //Notification messages
  static createSuccessfulMsg = 'Product has been created successfully';
  static errorWrongFormatMsg = 'This file format not supported!';
  static errorProductDuplicateMsg = 'Such product name exists!';
  static errorWatchLogsMsg = 'Error appeared, watch logs!';
  static errorNoImage = 'Please put product image!';
  static errorLargeImgSizeMsg = 'This image size is too big!';

  constructor(private notificationsService: NotificationsService) {
  }

  createSuccessfulMsg() {
    this.notificationsService.success(NotificationsManager.createTitle, NotificationsManager.createSuccessfulMsg);
  }

  /**
   * Try to notify detailed message
   * error should be formatted as ErrorDetail class and contain detail property
   * otherwise it will throw exception
   * @param error
   * @throws {ErrorDetail}
   */
  errorDetailedMsg(error: ErrorDetail) {
    if (!error.detail)
      throw error;
    this.notificationsService.error(NotificationsManager.errorTitle, error.detail);
  }

  errorWrongFormatMsg() {
    this.notificationsService.error(NotificationsManager.errorTitle, NotificationsManager.errorWrongFormatMsg);
  }

  errorProductDuplicateMsg() {
    this.notificationsService.error(NotificationsManager.errorTitle, NotificationsManager.errorProductDuplicateMsg);
  }

  logError(error : any) {
    console.log(error);
    this.notificationsService.error(NotificationsManager.errorTitle, NotificationsManager.errorWatchLogsMsg);
  }

  errorNoImageMsg() {
    this.notificationsService.error(NotificationsManager.errorTitle, NotificationsManager.errorNoImage);
  }

  errorLargeImgSizeMsg() {
    this.notificationsService.error(NotificationsManager.errorTitle, NotificationsManager.errorLargeImgSizeMsg);

  }
}
