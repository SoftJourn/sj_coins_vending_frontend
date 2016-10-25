export class Account {
  public static readonly SUPER_USER = "ROLE_SUPER_ADMIN";

  constructor(public ldapName: string,
              public fullName: string,
              public email: string,
              public authorities: string) {
  }


  public hasRole(role: string): boolean {
    if (this.authorities)
      return this.authorities.includes(role);
    return false;
  }

  public setRole(role: string, checked: boolean) {
    if(typeof this.authorities == 'undefined'||this.authorities==null)
      this.authorities="";

    let roles = this.authorities.split(',');
    let index = roles.indexOf(role);
    if (checked && index < 0) {
      if(!this.authorities)
        roles.pop();
      roles.push(role);
    }
    if (!checked && index > -1)
        roles.splice(index, 1);
    this.authorities=roles.toString();


  }

  // getrole(role: string){
  //   if(this[role])
  //     return this[role];
  //   else
  //     return false;
  // }
  // setrole(role: string, val: boolean){
  //   this[role]=val;
  // }
  // public getAuthorities(): string {
  //   let result: Array<string> = [];
  //   this.billing ? result.push("Billing") : '';
  //   this.inventory ? result.push("Inventory") : '';
  //   this.authorities = result.toString();
  //   return this.authorities;
  // }

  public isSuperUser(): boolean {
    if (this.authorities == Account.SUPER_USER)
      return true;
    else
      return false;
  }

  public getRole(): string {
    let regex = /.*ROLE_/;
    let withOutRole = this.authorities ? this.authorities.replace(regex, '') : '';
    return withOutRole.replace(/_/, ' ');
  }

}
