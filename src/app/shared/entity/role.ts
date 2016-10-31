export class Role {
  constructor(public authority: string
    , public superRole: boolean){
    this.authority = authority;
    this.superRole = superRole;
  }
  public toString (){
    return this.authority;
  }
}
