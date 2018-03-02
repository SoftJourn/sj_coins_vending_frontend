export class AccountDTO {
  constructor(public ldapId: string,
              public email: number,
              public fullName: string,
              public deleted: string) {
  }
}
