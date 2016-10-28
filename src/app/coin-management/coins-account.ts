export class CoinsAccount {

  constructor(
    public ldapId: string,
    public amount: number,
    public fullName: string
  ) {}
}

export const REGULAR = new AccountType('regular');
export const MERCHANT = new AccountType('merchant');

export class AccountType {
  constructor(public type: string) {}
}
