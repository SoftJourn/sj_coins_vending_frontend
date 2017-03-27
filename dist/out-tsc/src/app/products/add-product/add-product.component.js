var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from "@angular/core";
import { CategoryService } from "../../shared/services/category.service";
import { Product } from "../../shared/entity/product";
import { ProductService } from "../../shared/services/product.service";
import { Router } from "@angular/router";
import { UNSUPPORTED_MEDIA_TYPE } from "http-status-codes";
import { NotificationsManager } from "../../shared/notifications.manager";
import { ImageLoaderComponent } from "../../shared/image-loader/image-loader.component";
import { ProductFormComponent } from "../product-form/product-form.component";
import { Observable } from "rxjs";
export var AddProductComponent = (function () {
    function AddProductComponent(categoryService, productService, notify, router) {
        this.categoryService = categoryService;
        this.productService = productService;
        this.notify = notify;
        this.router = router;
        this.categories = [];
        this._mainProductURI = '/main/products';
    }
    AddProductComponent.prototype.ngOnInit = function () {
        this.initFromComponent();
    };
    AddProductComponent.prototype.submitCoverImage = function (productId) {
        var formData = this.imageLoaderComponent.getImageFormData('file');
        if (formData)
            return this.productService.updateImage(productId, formData);
        else
            return Observable.empty();
    };
    AddProductComponent.prototype.submitDescriptionImages = function (productId) {
        var formData = this.imageLoaderComponent.getDescriptionImagesFormData("files");
        if (formData)
            return this.productService.updateImages(productId, formData);
        else
            return Observable.empty();
    };
    AddProductComponent.prototype.submit = function () {
        var _this = this;
        if (!this.imageLoaderComponent.isEmpty()) {
            var formData = this.formComponent.form.value;
            this.productService.save(formData).subscribe(function (product) {
                _this.submitCoverImage(product.id)
                    .merge(_this.submitDescriptionImages(product.id))
                    .subscribe(undefined, function (error) { return _this.errorHandle(error); }, function () { return _this.reset(); });
            }, function (error) { return _this.errorHandle(error); });
        }
        else {
            this.notify.errorNoImageMsg();
        }
    };
    AddProductComponent.prototype.cancel = function () {
        this.router.navigate([this._mainProductURI]);
    };
    AddProductComponent.prototype.getCardOutlineClass = function () {
        if (this.formComponent && this.formComponent.formStyles)
            return this.formComponent.formStyles.getCardOutlineClass();
    };
    AddProductComponent.prototype.isValid = function () {
        return this.formComponent && this.imageLoaderComponent
            && this.formComponent.isValid && !this.imageLoaderComponent.isEmpty();
    };
    AddProductComponent.prototype.errorHandle = function (error) {
        var _productDuplicateCode = 1052;
        try {
            var errorDetail = error.json();
            if (error.status == UNSUPPORTED_MEDIA_TYPE) {
                this.notify.errorWrongFormatMsg();
            }
            else {
                if (errorDetail.code == _productDuplicateCode) {
                    this.notify.errorProductDuplicateMsg();
                }
                else {
                    this.notify.errorDetailedMsg(error.json());
                }
            }
        }
        catch (err) {
            this.notify.logError(err);
        }
    };
    AddProductComponent.prototype.initFromComponent = function () {
        var _this = this;
        this.categoryService.findAll().subscribe(function (categories) { return _this.setCategoriesAndEmptyProduct(categories); }, function (error) { return _this.notify.errorDetailedMsgOrConsoleLog(error); });
    };
    AddProductComponent.prototype.setCategoriesAndEmptyProduct = function (categories) {
        this.categories = categories;
        this.product = new Product();
        if (this.categories.length > 0)
            this.product.category = this.categories[0];
    };
    AddProductComponent.prototype.reset = function () {
        if (this.formComponent)
            this.formComponent.reset();
        if (this.imageLoaderComponent)
            this.imageLoaderComponent.reset();
    };
    __decorate([
        ViewChild("imageLoader"), 
        __metadata('design:type', ImageLoaderComponent)
    ], AddProductComponent.prototype, "imageLoaderComponent", void 0);
    __decorate([
        ViewChild("productForm"), 
        __metadata('design:type', ProductFormComponent)
    ], AddProductComponent.prototype, "formComponent", void 0);
    AddProductComponent = __decorate([
        Component({
            selector: 'add-product',
            templateUrl: './add-product.component.html',
            styleUrls: ['./add-product.component.scss']
        }), 
        __metadata('design:paramtypes', [CategoryService, ProductService, NotificationsManager, Router])
    ], AddProductComponent);
    return AddProductComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/products/add-product/add-product.component.js.map