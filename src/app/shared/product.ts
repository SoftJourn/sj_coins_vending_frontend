export class Product {
  id: number;
  price: number;
  name: string;
  imageUrl: string;
  description: string;
  category: string;


  constructor(id?: number,
              price?: number,
              name?: string,
              imageUrl?: string,
              description?: string,
              category?: string) {
    this.id = id;
    this.price = price;
    this.name = name;
    this.imageUrl = imageUrl;
    this.description = description;
    this.category = category;
  }
}
