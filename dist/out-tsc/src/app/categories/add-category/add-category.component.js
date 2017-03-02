var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, trigger, state, style, transition, animate } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Category } from "../../shared/entity/category";
import { CategoryService } from "../../shared/services/category.service";
import { NotificationsService } from "angular2-notifications/components";
import { FormValidationStyles } from "../../shared/form-validation-styles";
import { Router } from "@angular/router";
import { Output, Input } from "@angular/core/src/metadata/directives";
export var AddCategoryComponent = (function () {
    function AddCategoryComponent(categoryService, notificationService, router) {
        this.categoryService = categoryService;
        this.notificationService = notificationService;
        this.router = router;
        this.isVisible = false;
        this.isVisibleChange = new EventEmitter();
        this.categoryChange = new EventEmitter();
        this.visibility = 'hidden';
    }
    AddCategoryComponent.prototype.ngOnInit = function () {
        this.buildForm();
    };
    AddCategoryComponent.prototype.ngOnChanges = function () {
        this.visibility = this.isVisible ? 'shown' : 'hidden';
    };
    AddCategoryComponent.prototype.buildForm = function () {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required,
                Validators.maxLength(50),
                Validators.pattern('^[a-zA-Z\u0400-\u04FF]+[a-zA-Z \u0400-\u04FF]*[a-zA-Z\u0400-\u04FF]+$')
            ])
        });
        this.formStyles = new FormValidationStyles(this.form);
    };
    AddCategoryComponent.prototype.submit = function () {
        var _this = this;
        var category = new Category(this.form.get('name').value);
        this.categoryService.save(category)
            .subscribe(function (category) {
            _this.notificationService.success('Create', 'Category has been created successfully');
            _this.form.reset({
                name: ''
            });
            _this.categoryChange.emit(true);
        }, function (error) {
            try {
                var errorDetail = error.json();
                if (errorDetail.code == 1062) {
                    _this.notificationService.error('Error', 'Such category name exists!');
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
        });
    };
    AddCategoryComponent.prototype.cancel = function () {
        this.isVisible = false;
        this.isVisibleChange.emit(this.isVisible);
    };
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], AddCategoryComponent.prototype, "isVisible", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], AddCategoryComponent.prototype, "isVisibleChange", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], AddCategoryComponent.prototype, "categoryChange", void 0);
    AddCategoryComponent = __decorate([
        Component({
            selector: 'add-category',
            templateUrl: './add-category.component.html',
            styleUrls: ['./add-category.component.scss'],
            animations: [
                trigger('menuState', [
                    state('shown', style({
                        display: 'block'
                    })),
                    state('hidden', style({
                        display: 'none',
                    })),
                    transition('shown <=> hidden', [animate('100ms ease-out')])
                ])
            ]
        }), 
        __metadata('design:paramtypes', [CategoryService, NotificationsService, Router])
    ], AddCategoryComponent);
    return AddCategoryComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/categories/add-category/add-category.component.js.map