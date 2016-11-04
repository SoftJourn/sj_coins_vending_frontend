export class Role {

  public authority:string;
  constructor(object: Object);
  constructor(authority: string,superRole?: boolean);
  constructor(authority: string|Object
    , public superRole?: boolean) {

    if (authority instanceof Object) {
      let obj: Object = authority;
      this.constructor.apply(this,[obj['authority'], obj['superRole']]);
    } else {
      this.authority=<string>authority;
      if (!superRole) {
        this.superRole = false;
      }
    }

  }

  public toString() {
    return this.authority;
  }

  public static isValid(role: Role): boolean {
    return true;
  }
}

