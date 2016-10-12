import {Component, OnInit} from '@angular/core';
import {ProductService} from "../shared/services/product.service";
import {Product} from "../shared/entity/product";
import {NotificationsService} from "angular2-notifications";
import {ErrorDetail} from "../shared/entity/error-detail";
import {Response} from "@angular/http";

@Component({
  selector: 'product-list',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public products: Product[];

  constructor(private productService: ProductService,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.productService.findAll().subscribe(
      products => this.products = products,
      error => {
      }
    );
  }

  onDelete(id: number) {
    this.productService.delete(id).subscribe(
      () => {
      }, (error: Response) => {
        var errorDetail: ErrorDetail = error.json();
        if (errorDetail.code == 1451) {
          this.notificationService.error('Error', 'Can not delete, this product is being used!');
        } else {
          this.notificationService.error('Error', errorDetail.detail);
        }
      },
      () => {
        this.productService.findAll().subscribe(
          products => {
            this.products = products;
            this.notificationService.success('Success', 'Product was deleted successfully!');
          }
        )
      }
    )
  }
}
