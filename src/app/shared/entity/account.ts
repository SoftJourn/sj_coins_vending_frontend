import { Role } from "./role";
export class Account {

  constructor(public ldapName: string,
              public fullName: string,
              public email: string,
              public authorities: Role[]) {
  }


  public hasRole(role: string): boolean {
    if (typeof this.authorities == 'undefined' || this.authorities == null)
      return false;
    return this.authorities.some(r => r.authority == role);
  }

  public setRole(role: Role) {
    if (typeof this.authorities == 'undefined' || this.authorities == null)
      this.authorities = [];
    this.authorities.push(role);
  }

  public isSuperUser(): boolean {
    // this.authorities.returnreturn
    // if (this.authorities == Account.SUPER_USER)
    //   return true;
    // else
    //   return false;
    return false;
  }

  public getRole(): string {
    let regex = /.*ROLE_/;
    let result = [];
    if(this.authorities)
      this.authorities.forEach(role => result.push(role.authority.replace(regex, '').replace(/_/, ' ')));
    return result.toString();
  }

  public toString (){
    return JSON.stringify(this);
  }

}
