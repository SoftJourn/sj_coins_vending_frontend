export class Role {
  constructor(public authority: string
    , public isSuper: boolean){
    this.authority = authority;
    this.isSuper = isSuper;
  }
  public toString (){
    return this.authority;
  }
}
