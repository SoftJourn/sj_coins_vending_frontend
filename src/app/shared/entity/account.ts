export class Account {
  private _role: string;

  constructor(
    public ldapName: string,
    public fullName: string,
    public email: string,
    public authorities: string
  ) {}

  public get role(): string {
    let regex =/.*ROLE_/;
    return this._role = this.authorities.replace(regex,'');
  }
}
