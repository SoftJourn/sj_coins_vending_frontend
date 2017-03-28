import {NotificationsService} from "angular2-notifications";
import {ErrorDetail} from "./entity/error-detail";
import {Injectable} from "@angular/core";

@Injectable()
export class NotificationsManager {

  //Notification titles
  static createTitle = 'Create';
  static errorTitle = 'Error';
  static updateTitle = 'Update';

  //Notification messages
  static createSuccessfulMsg = 'Product has been created successfully';
  static errorWrongFormatMsg = 'This file format not supported!';
  static errorProductDuplicateMsg = 'Such product name exists!';
  static errorWatchLogsMsg = 'Error appeared, watch logs!';
  static errorNoImage = 'Please put product image!';
  static errorLargeImgSizeMsg = 'This image size is too big!';
  static updateSuccessful = 'Product has been updated successfully';
  private static errorFactNameDuplicate = 'Fact name already exists';

  constructor(private notificationsService: NotificationsService) {
  }

  updateSuccessfulMsg(){
    this.notificationsService.success(NotificationsManager.updateTitle,NotificationsManager.updateSuccessful);
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

  /**
   * Try to notify detailed message
   * error should be formatted as ErrorDetail class and contain detail property
   * otherwise it will log error
   * @param error
   * @throws {ErrorDetail}
   */
  errorDetailedMsgOrConsoleLog(error: ErrorDetail) {
    try{
      this.errorDetailedMsg(error);
    } catch (err){
      this.logError(error);
    }
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

  errorFactNameDuplicate() {
    this.notificationsService.error(NotificationsManager.errorTitle, NotificationsManager.errorFactNameDuplicate)
  }
}
