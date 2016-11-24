import { Component, OnInit } from "@angular/core";
import { ProductService } from "../shared/services/product.service";
import { Product } from "../shared/entity/product";
import { NotificationsService } from "angular2-notifications";
import { ErrorDetail } from "../shared/entity/error-detail";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'product-list',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public products: Product[];
  form: FormGroup;

  searchClass: string = 'fa-search';
  cancelClass: string = 'fa-close';
  searchChangeClass: string = this.searchClass;

  constructor(private productService: ProductService,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.buildForm();
    this.productService.findAll().subscribe(
      products => this.products = products,
      error => {
        try {
          let errorDetail = <ErrorDetail> error.json();
          this.notificationService.error('Error', errorDetail.detail);
        } catch (err) {
          console.log(err);
          this.notificationService.error('Error', 'Error appeared, watch logs!');
        }
      }
    );
    this.form.get('name').valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(change => {
        if (change != '') {
          this.searchChangeClass = this.cancelClass;
        } else {
          this.searchChangeClass = this.searchClass;
        }
        this.productService.findAllThatContainByName(change).subscribe(
          products => this.products = products,
          error => {
            this.notificationService.error('Error', 'You entered invalid search text!');
          });
      });
  }

  private buildForm(): void {
    this.form = new FormGroup({
      name: new FormControl('')
    });
  }

  searchCancel() {
    this.form.get('name').patchValue('');
    this.searchChangeClass = this.searchClass;
  }

  onDelete(id: number) {
    this.productService.delete(id).subscribe(
      () => {
      }, error => {
        try {
          let errorDetail = <ErrorDetail> error.json();
          if (errorDetail.code == 1451) {
            this.notificationService.error('Error', 'Can not delete, this product is being used!');
          } else {
            this.notificationService.error('Error', errorDetail.detail);
          }
        } catch (err) {
          console.log(err);
          this.notificationService.error('Error', 'Error appeared, watch logs!');
        }
      },
      () => {
        this.productService.findAll().subscribe(
          products => this.products = products,
          error => {
            try {
              let errorDetail = <ErrorDetail> error.json();
              this.notificationService.error('Error', errorDetail.detail);
            } catch (err) {
              console.log(err);
              this.notificationService.error('Error', 'Error appeared, watch logs!');
            }
          }
        );
      }
    )
  }
}
