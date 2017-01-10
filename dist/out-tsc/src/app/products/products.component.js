var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { ProductService } from "../shared/services/product.service";
import { NotificationsService } from "angular2-notifications";
import { FormControl, FormGroup } from "@angular/forms";
export var ProductsComponent = (function () {
    function ProductsComponent(productService, notificationService) {
        this.productService = productService;
        this.notificationService = notificationService;
        this.searchClass = 'fa-search';
        this.cancelClass = 'fa-close';
        this.searchChangeClass = this.searchClass;
    }
    ProductsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.buildForm();
        this.productService.findAll().subscribe(function (products) { return _this.products = products; }, function (error) {
            try {
                var errorDetail = error.json();
                if (!errorDetail.detail)
                    //noinspection ExceptionCaughtLocallyJS
                    throw errorDetail;
                _this.notificationService.error('Error', errorDetail.detail);
            }
            catch (err) {
                console.log(err);
                _this.notificationService.error('Error', 'Error appeared, watch logs!');
            }
        });
        this.form.get('name').valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(function (change) {
            if (change != '') {
                _this.searchChangeClass = _this.cancelClass;
            }
            else {
                _this.searchChangeClass = _this.searchClass;
            }
            _this.productService.findAllThatContainByName(change).subscribe(function (products) { return _this.products = products; }, function (error) {
                _this.notificationService.error('Error', 'You entered invalid search text!');
            });
        });
    };
    ProductsComponent.prototype.buildForm = function () {
        this.form = new FormGroup({
            name: new FormControl('')
        });
    };
    ProductsComponent.prototype.searchCancel = function () {
        this.form.get('name').patchValue('');
        this.searchChangeClass = this.searchClass;
    };
    ProductsComponent.prototype.onDelete = function (id) {
        var _this = this;
        this.productService.delete(id).subscribe(function () {
        }, function (error) {
            try {
                var errorDetail = error.json();
                if (errorDetail.code == 1451) {
                    _this.notificationService.error('Error', 'Can not delete, this product is being used!');
                }
                else {
                    if (!errorDetail.detail)
                        //noinspection ExceptionCaughtLocallyJS
                        throw errorDetail;
                    _this.notificationService.error('Error', errorDetail.detail);
                }
            }
            catch (err) {
                console.log(err);
                _this.notificationService.error('Error', 'Error appeared, watch logs!');
            }
        }, function () {
            _this.productService.findAll().subscribe(function (products) { return _this.products = products; }, function (error) {
                try {
                    var errorDetail = error.json();
                    if (!errorDetail.detail)
                        //noinspection ExceptionCaughtLocallyJS
                        throw errorDetail;
                    _this.notificationService.error('Error', errorDetail.detail);
                }
                catch (err) {
                    console.log(err);
                    _this.notificationService.error('Error', 'Error appeared, watch logs!');
                }
            });
        });
    };
    ProductsComponent = __decorate([
        Component({
            selector: 'product-list',
            templateUrl: './products.component.html',
            styleUrls: ['./products.component.scss']
        }), 
        __metadata('design:paramtypes', [ProductService, NotificationsService])
    ], ProductsComponent);
    return ProductsComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/products/products.component.js.map