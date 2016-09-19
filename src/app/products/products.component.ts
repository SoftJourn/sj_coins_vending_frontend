import { Component, OnInit } from '@angular/core';
import { ProductService } from "../shared/services/product.service";
import { Product } from "../shared/entity/product";

@Component({
  selector: 'product-list',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public products: Product[];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.findAll().subscribe(
      products => this.products = products,
      error => {}
    );
  }

  onDelete(id: number) {
    this.productService.delete(id).subscribe(
      () => {},
      error => {},
      () => {
        this.productService.findAll().subscribe(
          products => this.products = products
        )
      }
    )
  }
}
