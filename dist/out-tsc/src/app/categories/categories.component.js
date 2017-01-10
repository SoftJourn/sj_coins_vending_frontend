var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewContainerRef } from "@angular/core";
import { CategoryService } from "../shared/services/category.service";
import { NotificationsService } from "angular2-notifications";
import { AddMenu } from "../shared/entity/add-menu";
import { Overlay } from "angular2-modal";
import { Modal } from "angular2-modal/plugins/bootstrap";
export var CategoriesComponent = (function () {
    function CategoriesComponent(categoryService, notificationService, overlay, vcRef, modal) {
        this.categoryService = categoryService;
        this.notificationService = notificationService;
        this.modal = modal;
        this.addMenu = new AddMenu();
        overlay.defaultViewContainer = vcRef;
    }
    CategoriesComponent.prototype.ngOnInit = function () {
        this.updateCategories();
    };
    CategoriesComponent.prototype.updateCategories = function () {
        var _this = this;
        this.categoryService.findAll().subscribe(function (categories) { return _this.categories = categories; }, function (error) {
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
    CategoriesComponent.prototype.deleteCategory = function (id) {
        var _this = this;
        this.modal.confirm()
            .size('sm')
            .isBlocking(true)
            .showClose(true)
            .keyboard(27)
            .title('Delete category')
            .body('Do you really want to delete this category?')
            .okBtn('Yes')
            .okBtnClass('btn btn-success modal-footer-confirm-btn')
            .cancelBtn('Cancel')
            .cancelBtnClass('btn btn-secondary modal-footer-confirm-btn')
            .open()
            .then(function (response) {
            response.result.then(function () {
                _this.categoryService.delete(id).subscribe(function (next) {
                }, function (error) {
                    try {
                        var errorDetail = error.json();
                        if (errorDetail.code == 1451) {
                            _this.notificationService.error('Error', 'Can not delete, this category is being used!');
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
                    _this.categoryService.findAll().subscribe(function (categories) {
                        _this.categories = categories;
                        _this.notificationService.success('Delete', 'Category has been deleted successfully.');
                    });
                });
            }, function () {
            });
        });
    };
    CategoriesComponent = __decorate([
        Component({
            selector: 'categories-list',
            templateUrl: './categories.component.html',
            styleUrls: ['./categories.component.scss']
        }), 
        __metadata('design:paramtypes', [CategoryService, NotificationsService, Overlay, ViewContainerRef, Modal])
    ], CategoriesComponent);
    return CategoriesComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/categories/categories.component.js.map