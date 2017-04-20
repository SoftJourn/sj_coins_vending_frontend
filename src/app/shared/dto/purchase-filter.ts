export class PurchaseFilter {

  constructor(public machineId?: number,
              public type?: string,
              public timeZoneOffSet?: number,
              public start?: string,
              public due?: string,) {
  }

}
