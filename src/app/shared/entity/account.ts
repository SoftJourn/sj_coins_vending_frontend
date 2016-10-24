export class Account {

  public billing?:boolean=false;
  public inventory?:boolean=false;

  constructor(
    public ldapName: string,
    public fullName: string,
    public email: string,
    public authorities: string
  ) {}

  public getAuthorities(): string{
    let result:Array<string>=[];
    this.billing?result.push("Billing"):'';
    this.inventory?result.push("Inventory"):'';
    this.authorities=result.toString();
    return this.authorities;
  }
}
