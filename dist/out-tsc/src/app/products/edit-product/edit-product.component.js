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
import { AppProperties } from "../../shared/app.properties";
import { ActivatedRoute, Router } from "@angular/router";
import { ImageUploadService } from "../../shared/services/image-upload.service";
export var EditProductComponent = (function () {
    function EditProductComponent(categoryService, productService, notificationService, route, router, imageUpload) {
        this.categoryService = categoryService;
        this.productService = productService;
        this.notificationService = notificationService;
        this.route = route;
        this.router = router;
        this.imageUpload = imageUpload;
        this.imagForCropper = null;
        this.imgName = null;
        this.showDialog = false;
        this.imageUpload.imageName = null;
    }
    EditProductComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.route.params.subscribe(function (params) {
            _this.productIndex = +params['id'];
            _this.productService.findOne(_this.productIndex).subscribe(function (product) {
                _this.product = product;
                _this.buildForm();
                // console.log(this.imageFile);
                _this.categoryService.findAll().subscribe(function (categories) {
                    _this.categories = categories;
                    for (var i = 0; i < _this.categories.length; i++) {
                        if (categories[i].name == _this.product.category.name) {
                            _this.form.get('category').patchValue(categories[i]);
                        }
                    }
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
        });
    };
    EditProductComponent.prototype.buildForm = function () {
        if (this.product.imageUrl) {
            this.imageUpload.imageSrc = AppProperties.API_VENDING_ENDPOINT + "/" + this.product.imageUrl;
        }
        else {
            this.imageUpload.imageSrc = '/assets/images/default-product-350x350.jpg';
        }
        this.form = new FormGroup({
            name: new FormControl(this.product.name, [Validators.required,
                Validators.maxLength(50),
                Validators.pattern('^[a-zA-Z0-9\u0400-\u04FF]+[ a-zA-Z0-9\u0400-\u04FF,-]*[a-zA-Z0-9\u0400-\u04FF,-]+')
            ]),
            price: new FormControl(this.product.price, [Validators.required,
                Validators.maxLength(5),
                Validators.pattern('\\d+')]),
            description: new FormControl(this.product.description),
            category: new FormControl(this.product.category.name, Validators.required)
        });
        this.formStyles = new FormValidationStyles(this.form);
    };
    EditProductComponent.prototype.submit = function () {
        var _this = this;
        if (this.imageUpload.imageName != null && this.imageUpload.imageName != '') {
            this.productService.update(this.productIndex, this.form.value)
                .flatMap(function (product) {
                _this.router.navigate(['/main/products']);
                _this.notificationService.success('Update', 'Product has been updated successfully');
                var blob = _this.imageUpload.dataURItoBlob(_this.imageUpload.imageSrc);
                _this.imageUpload.formData = new FormData();
                _this.imageUpload.formData.append('file', blob, _this.imageUpload.imageFile.name);
                return _this.productService.updateImage(_this.productIndex, _this.imageUpload.formData);
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
            });
        }
        else if (this.product.imageUrl) {
            this.productService.update(this.productIndex, this.form.value)
                .do(function (product) {
            })
                .subscribe(function () {
                _this.router.navigate(['/main/products']);
                _this.notificationService.success('Update', 'Product has been updated successfully');
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
            });
        }
        else {
            this.notificationService.error('Error', 'Please put product image!');
        }
    };
    EditProductComponent.prototype.reset = function () {
        this.router.navigate(['/main/products']);
    };
    EditProductComponent.prototype.setDataForImage = function (value) {
        this.imageUpload.handleImageLoad();
        this.imageUpload.imageSrc = value;
        this.imageUpload.imageName = this.imgName;
    };
    EditProductComponent.prototype.handleInputChange = function ($event) {
        var _this = this;
        this.imageUpload.fileChangeListener($event).subscribe(function (img) {
            _this.imagForCropper = img.src;
            _this.imgName = img.name;
            _this.showDialog = !_this.showDialog;
        }, function (err) {
            console.log(err);
        });
    };
    EditProductComponent = __decorate([
        Component({
            selector: 'app-edit-product',
            templateUrl: './edit-product.component.html',
            styleUrls: ['./edit-product.component.scss']
        }), 
        __metadata('design:paramtypes', [CategoryService, ProductService, NotificationsService, ActivatedRoute, Router, ImageUploadService])
    ], EditProductComponent);
    return EditProductComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/products/edit-product/edit-product.component.js.map