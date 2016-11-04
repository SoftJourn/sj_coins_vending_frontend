import { Role } from "./role";
export class Account {

  constructor(object: Object);
  constructor(ldapName: string, fullName: string, email: string, authorities: Role[]);
  constructor(public ldapName: string|Object,
              public fullName?: string,
              public email?: string,
              public authorities?: Role[]) {
    if (ldapName instanceof Object) {
      let obj = ldapName;

      if (Account.isValidInstance(obj)) {
        this.ldapName = obj['ldapName'];
        this.fullName = obj['fullName'];
        this.email = obj['email'];
        this.authorities = obj['authorities'].map(role=>new Role(role));
      } else {
        return null;
      }

    }
  }

  public static isValidInstance(obj: Object): boolean {
    let hasAllProperties = obj.hasOwnProperty("ldapName")
      && obj.hasOwnProperty("fullName")
      && obj.hasOwnProperty("email")
      && obj.hasOwnProperty("authorities");

    if (!hasAllProperties)
      return false;

    let typeAccordance = typeof(obj['ldapName']) == "string"
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
    return result.toString();
  }

  public toString() {
    return JSON.stringify(this);
  }


}
