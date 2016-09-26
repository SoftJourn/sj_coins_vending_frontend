import {Category} from "./category";

export class Product {

  constructor(
    public id: number,
    public price: number,
    public name: string,
    public imageUrl: string,
    public description: string,
    public category: Category
  ) {}
}
