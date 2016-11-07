import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { Product } from "../../shared/entity/product";
import { AppProperties } from "../../shared/app.properties";
import { Router } from "@angular/router";
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Overlay } from "angular2-modal";

@Component({
  selector: 'product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;
  @Output() onDelete = new EventEmitter<number>();
  imageUrl: string;

  constructor(private router: Router, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    if (this.product.imageUrl != null) {
      this.imageUrl = `${AppProperties.API_VENDING_ENDPOINT}/${this.product.imageUrl}`
    } else {
      this.imageUrl = '/assets/images/default-product-350x350.jpg';
    }
  }

  deleteProduct(): void {
    this.modal.confirm()
      .size('sm')
      .isBlocking(true)
      .showClose(true)
      .keyboard(27)
      .title('Delete product')
      .body('Do you really want to delete this product?')
      .okBtn('Yes')
      .okBtnClass('btn btn-success modal-footer-confirm-btn')
      .cancelBtn('Cancel')
      .cancelBtnClass('btn btn-secondary modal-footer-confirm-btn')
      .open()
      .then(
        (response)=> {
          response.result.then(
            () => {
              this.onDelete.emit(this.product.id);
            },
            () => {}
          );
        });
  }

  onEditProduct() {
    this.router.navigate(['/main/products', this.product.id, 'edit'])
  }
}
