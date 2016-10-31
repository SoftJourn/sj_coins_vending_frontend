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

  public setRole(roleName: string, active: boolean) {
    if (typeof this.authorities == 'undefined' || this.authorities == null)
      this.authorities = [];

    let index=-1;

    for(let i=0;i<this.authorities.length;i++){
      if(this.authorities[i].authority==roleName){
        index=i;
        break;
      }
    }
    if(active && index < 0){
      this.authorities.push(new Role(roleName,false));
    }
    if(!active && index > -1){
      this.authorities.splice(index,1);
    }
  }

  public isSuperUser(): boolean {
    let isSuper=false;
    for(let i=0;i<this.authorities.length;i++){
      if(this.authorities[i].superRole==true){
        isSuper=true;
        break;
      }
    }
    return isSuper;
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
