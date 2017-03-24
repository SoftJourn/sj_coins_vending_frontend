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
import { ProductService } from "../../shared/services/product.service";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { ImageUploadService } from "../../shared/services/image-upload.service";
import { NotificationsManager } from "../../shared/notifications.manager";
import { UNSUPPORTED_MEDIA_TYPE } from "http-status-codes";
import { ProductFormComponent } from "../product-form/product-form.component";
import { ImageLoaderComponent } from "../../shared/image-loader/image-loader.component";
import { AppProperties } from "../../shared/app.properties";
export var EditProductComponent = (function () {
    function EditProductComponent(categoryService, productService, notify, route, router, imageUpload) {
        this.categoryService = categoryService;
        this.productService = productService;
        this.notify = notify;
        this.route = route;
        this.router = router;
        this.imageUpload = imageUpload;
        this._categories = [];
        this._productUrl = '/main/products';
        this.imageUpload.imageName = null;
    }
    EditProductComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.route.params.subscribe(function (params) {
            _this.productIndex = +params['id'];
            var finaleSource = _this.formFinalSource(_this.productIndex);
            finaleSource.subscribe(function (obj) { return _this.setData(obj); });
        });
    };
    EditProductComponent.prototype.reset = function () {
        this.router.navigate([this._productUrl]);
    };
    EditProductComponent.prototype.submit = function () {
        var _this = this;
        if (!this.imageLoaderComponent.isEmpty()) {
            var productEntity = this.formComponent.form.value;
            this.productService.update(this.productIndex, productEntity).subscribe(function (product) {
                _this.submitImages(product)
                    .subscribe(undefined, function (error) { return _this.errorHandle(error); }, function () { return _this.reset(); });
            }, function (error) { return _this.errorHandle(error); });
        }
        else {
            this.notify.errorNoImageMsg();
        }
    };
    EditProductComponent.prototype.submitImages = function (product) {
        var coverImageOutcome = this.updateCoverImage(product.id);
        var loadImagesOutcome = this.loadImages(product.id);
        var deleteImagesOutcome = this.deleteImages();
        return coverImageOutcome
            .merge(loadImagesOutcome)
            .concat(deleteImagesOutcome);
    };
    EditProductComponent.prototype.updateCoverImage = function (productId) {
        var _this = this;
        var formData = this.imageLoaderComponent.getImageFormData('file');
        if (formData) {
            return this.productService.updateImage(productId, formData);
        }
        else {
            //TODO Update cover image by image id. Involved back-end changes. This is temporary solution
            return this.productService.getImageBlob(this.imageLoaderComponent.image.src)
                .flatMap(function (blob) {
                var form = new FormData();
                form.append('file', blob);
                return _this.productService.updateImage(productId, form);
            });
        }
    };
    EditProductComponent.prototype.loadImages = function (productId) {
        var formData = this.imageLoaderComponent.getDescriptionImagesFormData("files");
        if (formData)
            return this.productService.updateImages(productId, formData);
        else
            return Observable.empty();
    };
    EditProductComponent.prototype.deleteImages = function () {
        var _this = this;
        var deletedUrls = this.imageLoaderComponent.getDeletedUrls(this._originImages);
        var deleteOutcome = Observable.empty();
        deletedUrls
            .forEach(function (url) { return deleteOutcome = deleteOutcome.merge(_this.productService.deleteImage(url)); });
        return deleteOutcome;
    };
    //TODO is valid not working
    //Error: Expression has changed after it was checked. Previous value: 'true'. Current value: 'false'
    EditProductComponent.prototype.isValid = function () {
        return this.formComponent && this.imageLoaderComponent
            && this.formComponent.isValid() && !this.imageLoaderComponent.isEmpty();
    };
    EditProductComponent.prototype.formFinalSource = function (productId) {
        var _this = this;
        var productSource = this.productService.findOne(productId).map(function (product) {
            _this.product = product;
            _this.fillImageComponent(product);
            return { product: product, categories: _this._categories };
        });
        var categorySource = this.categoryService.findAll().map(function (categories) {
            _this._categories = categories;
            return { product: _this.product, categories: categories };
        });
        return productSource.merge(categorySource);
    };
    EditProductComponent.prototype.fillImageComponent = function (product) {
        var urls = product.imageUrls;
        var i = 0;
        this._originCover = EditProductComponent.getAbsolutePath(product.imageUrl);
        if (urls && urls.length) {
            this._originImages = urls.map(function (url) { return EditProductComponent.getAbsolutePath(url); });
            for (i; i < urls.length; i++) {
                var image = this.formatImage(urls[i], i);
                if (image.src.localeCompare(this._originCover) != 0)
                    this.imageLoaderComponent.addImageItem(image);
            }
        }
        this.imageLoaderComponent.addImageItem(this.formatImage(product.imageUrl, i));
    };
    EditProductComponent.prototype.formatImage = function (url, i) {
        var image = new Image();
        image.src = EditProductComponent.getAbsolutePath(url);
        image.name = "image" + i;
        return image;
    };
    EditProductComponent.getAbsolutePath = function (relativePath) {
        return AppProperties.API_VENDING_ENDPOINT + '/' + relativePath;
    };
    EditProductComponent.prototype.setData = function (obj) {
        if (obj.product && obj.categories && obj.categories.length) {
            this.formComponent.setProduct(obj.product, obj.categories);
        }
    };
    EditProductComponent.prototype.errorHandle = function (error) {
        var productDuplicateCode = 1062;
        try {
            var errorDetail = error.json();
            if (error.status == UNSUPPORTED_MEDIA_TYPE) {
                this.notify.errorWrongFormatMsg();
            }
            else {
                if (errorDetail.code == productDuplicateCode) {
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
    __decorate([
        ViewChild("productForm"), 
        __metadata('design:type', ProductFormComponent)
    ], EditProductComponent.prototype, "formComponent", void 0);
    __decorate([
        ViewChild("imageLoader"), 
        __metadata('design:type', ImageLoaderComponent)
    ], EditProductComponent.prototype, "imageLoaderComponent", void 0);
    EditProductComponent = __decorate([
        Component({
            selector: 'app-edit-product',
            templateUrl: './edit-product.component.html',
            styleUrls: ['./edit-product.component.scss']
        }), 
        __metadata('design:paramtypes', [CategoryService, ProductService, NotificationsManager, ActivatedRoute, Router, ImageUploadService])
    ], EditProductComponent);
    return EditProductComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/products/edit-product/edit-product.component.js.map