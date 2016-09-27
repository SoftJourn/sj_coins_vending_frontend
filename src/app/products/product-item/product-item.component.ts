import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from "../../shared/entity/product";
import { AppProperties } from "../../shared/app.properties";

@Component({
  selector: 'product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;
  @Output() onDelete = new EventEmitter<number>();
  imageUrl: string;

  constructor() { }

  ngOnInit() {
    if (this.product.imageUrl != null) {
      this.imageUrl = `${AppProperties.API_VENDING_ENDPOINT}/${this.product.imageUrl}`
    } else {
      this.imageUrl = '/assets/images/default-product-350x350.jpg';
    }
  }

  deleteProduct(): void {
    this.onDelete.emit(this.product.id);
  }
}
