export class Purchase {


  constructor(public account: string = '',
              public date: Date,
              public product: string,
              public price: number) {
  }
}
