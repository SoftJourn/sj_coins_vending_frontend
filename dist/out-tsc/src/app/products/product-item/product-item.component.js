var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { Product } from "../../shared/entity/product";
import { AppProperties } from "../../shared/app.properties";
import { Router } from "@angular/router";
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Overlay } from "angular2-modal";
export var ProductItemComponent = (function () {
    function ProductItemComponent(router, overlay, vcRef, modal) {
        this.router = router;
        this.modal = modal;
        this.onDelete = new EventEmitter();
        overlay.defaultViewContainer = vcRef;
    }
    ProductItemComponent.prototype.ngOnInit = function () {
        if (this.product.imageUrl != null) {
            this.imageUrl = AppProperties.API_VENDING_ENDPOINT + "/" + this.product.imageUrl;
        }
        else {
            this.imageUrl = '/assets/images/default-product-350x350.jpg';
        }
    };
    ProductItemComponent.prototype.deleteProduct = function () {
        var _this = this;
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
            .then(function (response) {
            response.result.then(function () {
                _this.onDelete.emit(_this.product.id);
            }, function () { });
        });
    };
    ProductItemComponent.prototype.onEditProduct = function () {
        this.router.navigate(['/main/products', this.product.id, 'edit']);
    };
    __decorate([
        Input(), 
        __metadata('design:type', Product)
    ], ProductItemComponent.prototype, "product", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], ProductItemComponent.prototype, "onDelete", void 0);
    ProductItemComponent = __decorate([
        Component({
            selector: 'product-item',
            templateUrl: './product-item.component.html',
            styleUrls: ['./product-item.component.scss']
        }), 
        __metadata('design:paramtypes', [Router, Overlay, ViewContainerRef, Modal])
    ], ProductItemComponent);
    return ProductItemComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/products/product-item/product-item.component.js.map