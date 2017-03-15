import {Category} from "./category";

export class Product {

  constructor(public id : number = 0,
              public price : number = 0,
              public name : string = '',
              public imageUrl : string = '',
              public imageUrls : string = '',
              public description : string = '',
              public category : Category = new Category()) {
  }
}
