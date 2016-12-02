export class CoinsAccount {

  constructor(
    public ldapId: string,
    public amount: number,
    public fullName: string,
    public isNew: boolean
  ) {}
}

export class AccountType {
  constructor(public type: string) {}
}

export const REGULAR = new AccountType('regular');
export const MERCHANT = new AccountType('merchant');
