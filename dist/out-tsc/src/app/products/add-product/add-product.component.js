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
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { CategoryService } from "../../shared/services/category.service";
import { ProductService } from "../../shared/services/product.service";
import { NotificationsService } from "angular2-notifications/components";
import { FormValidationStyles } from "../../shared/form-validation-styles";
import { Router } from "@angular/router";
import { ImageUploadService } from "../../shared/services/image-upload.service";
export var AddProductComponent = (function () {
    function AddProductComponent(categoryService, productService, notificationService, router, imageUpload) {
        this.categoryService = categoryService;
        this.productService = productService;
        this.notificationService = notificationService;
        this.router = router;
        this.imageUpload = imageUpload;
        this.imagForCropper = null;
        this.imgName = null;
        this.showDialog = false;
        this.imageUpload.imageName = null;
    }
    AddProductComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.imageUpload.imageSrc = this.imageUpload.defaultImageSrc;
        this.buildForm();
        this.categoryService.findAll().subscribe(function (categories) {
            _this.categories = categories;
            _this.form.get('category').patchValue(categories[0]);
        }, function (error) {
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
    };
    AddProductComponent.prototype.buildForm = function () {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required,
                Validators.maxLength(50),
                Validators.pattern('^[a-zA-Z0-9\u0400-\u04FF]+[ a-zA-Z0-9\u0400-\u04FF,-]*[a-zA-Z0-9\u0400-\u04FF,-]+')
            ]),
            price: new FormControl('', [Validators.required,
                Validators.maxLength(5),
                Validators.pattern('\\d+')]),
            description: new FormControl(''),
            category: new FormControl('', Validators.required)
        });
        this.formStyles = new FormValidationStyles(this.form);
    };
    AddProductComponent.prototype.submit = function () {
        var _this = this;
        if (this.imageUpload.imageName != null && this.imageUpload.imageName != '') {
            this.productService.save(this.form.value)
                .flatMap(function (product) {
                _this.notificationService.success('Create', 'Product has been created successfully');
                var blob = _this.imageUpload.dataURItoBlob(_this.imageUpload.imageSrc);
                _this.imageUpload.formData = new FormData();
                _this.imageUpload.formData.append('file', blob, _this.imageUpload.imageFile.name);
                return _this.productService.updateImage(product.id, _this.imageUpload.formData);
            })
                .subscribe(function () {
            }, function (error) {
                try {
                    var errorDetail = error.json();
                    if (error.status == 415) {
                        _this.notificationService.error('Error', 'This file format not supported!');
                    }
                    else {
                        if (errorDetail.code == 1062) {
                            _this.notificationService.error('Error', 'Such product name exists!');
                        }
                        else {
                            if (!errorDetail.detail)
                                //noinspection ExceptionCaughtLocallyJS
                                throw errorDetail;
                            _this.notificationService.error('Error', errorDetail.detail);
                        }
                    }
                }
                catch (err) {
                    console.log(err);
                    _this.notificationService.error('Error', 'Error appeared, watch logs!');
                }
            }, function () {
                _this.imageUpload.cleanImageData();
                _this.imageUpload.imageSrc = _this.imageUpload.defaultImageSrc;
                _this.form.reset({
                    name: '',
                    price: '',
                    description: '',
                    category: _this.categories[0]
                });
            });
        }
        else {
            this.notificationService.error('Error', 'Please put product image!');
        }
    };
    AddProductComponent.prototype.reset = function () {
        this.router.navigate(['/main/products']);
    };
    AddProductComponent.prototype.setDataForImage = function (value) {
        this.imageUpload.handleImageLoad();
        this.imageUpload.imageSrc = value;
        this.imageUpload.imageName = this.imgName;
    };
    AddProductComponent.prototype.handleInputChange = function ($event) {
        var _this = this;
        this.imageUpload.fileChangeListener($event).subscribe(function (img) {
            _this.imagForCropper = img.src;
            _this.imgName = img.name;
            _this.showDialog = !_this.showDialog;
        }, function (error) {
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
    };
    ;
    AddProductComponent = __decorate([
        Component({
            selector: 'add-product',
            templateUrl: './add-product.component.html',
            styleUrls: ['./add-product.component.scss']
        }), 
        __metadata('design:paramtypes', [CategoryService, ProductService, NotificationsService, Router, ImageUploadService])
    ], AddProductComponent);
    return AddProductComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/products/add-product/add-product.component.js.map