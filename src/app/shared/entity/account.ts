import { Role } from "./role";
export class Account {

  public ldapId: string;

  constructor(object: Object);
  constructor(ldapName: string, fullName: string, email: string, authorities: Role[]);
  constructor(fistParam: string|Object,
              public fullName?: string,
              public email?: string,
              public authorities?: Role[]) {
    if (fistParam instanceof Object) {
      let obj = fistParam;

      if (Account.isValidInstance(obj)) {
        this.ldapId = obj['ldapId'];
        this.fullName = obj['fullName'];
        this.email = obj['email'];
        this.authorities = obj['authorities'].map(role=>new Role(role));
      } else {
        return null;
      }
    } else {
      this.ldapId = <string>fistParam;
    }
  }

  public static isValidInstance(obj: Object): boolean {
    let hasAllProperties = obj.hasOwnProperty("ldapId")
      && obj.hasOwnProperty("fullName")
      && obj.hasOwnProperty("email")
      && obj.hasOwnProperty("authorities");

    if (!hasAllProperties)
      return false;

    let typeAccordance = typeof(obj['ldapId']) == "string"
      && typeof(obj['fullName']) == "string"
      && typeof(obj['email']) == "string"
      && typeof(obj['authorities']) == "object"
      && obj['authorities'] instanceof Array;

    if (!typeAccordance)
      return false;

    let array: Array<Role> = obj['authorities'];

    return array.every(role=>Role.isValid(role));
  }

  public hasRole(role: string): boolean {
    if (typeof this.authorities == 'undefined' || this.authorities == null)
      return false;
    return this.authorities.some(r => r.authority == role);
  }

  public setRole(roleName: string, active: boolean) {
    if (typeof this.authorities == 'undefined' || this.authorities == null)
      this.authorities = [];

    let index = -1;

    for (let i = 0; i < this.authorities.length; i++) {
      if (this.authorities[i].authority == roleName) {
        index = i;
        break;
      }
    }
    if (active && index < 0) {
      this.authorities.push(new Role(roleName, false));
    }
    if (!active && index > -1) {
      this.authorities.splice(index, 1);
    }
  }

  public isSuperUser(): boolean {
    let isSuper = false;
    for (let i = 0; i < this.authorities.length; i++) {
      if (this.authorities[i].superRole == true) {
        isSuper = true;
        break;
      }
    }
    return isSuper;
  }

  public getRole(): string {
    let regex = /.*ROLE_/;
    let result = [];
    if (this.authorities)
      this.authorities.forEach(role => result.push(role.authority.replace(regex, '').replace(/_/, ' ')));
    return result.toString().replace(/,/g, ', ');
  }

  public toString() {
    return JSON.stringify(this);
  }


}
