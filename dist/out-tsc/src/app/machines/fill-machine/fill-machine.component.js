var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, style, state, animate, transition, trigger, Renderer, ViewChild, ElementRef } from "@angular/core";
import { MachineService } from "../../shared/services/machine.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../shared/services/product.service";
import { NotificationsService } from "angular2-notifications";
import { AppProperties } from "../../shared/app.properties";
import { BrowserDomAdapter } from "@angular/platform-browser/src/browser/browser_adapter";
export var FillMachineComponent = (function () {
    function FillMachineComponent(machineService, productService, route, notificationService, renderer, hostElement) {
        this.machineService = machineService;
        this.productService = productService;
        this.route = route;
        this.notificationService = notificationService;
        this.renderer = renderer;
        this.hostElement = hostElement;
        this.cellFormState = 'inactive';
        this.selectedField = null;
        this.selectedRowId = -1;
        this.changedFields = [];
        this.domAdapter = new BrowserDomAdapter();
    }
    FillMachineComponent.prototype.ngOnInit = function () {
        var _this = this;
        var id = parseInt(this.route.snapshot.params['id']);
        this.machineService.findOne(id).subscribe(function (machine) {
            _this.machine = machine;
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
        this.productService.findAll().subscribe(function (products) {
            _this.products = products;
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
        this.form = new FormGroup({
            fieldInternalId: new FormControl('', Validators.required),
            product: new FormControl('', Validators.required),
            count: new FormControl('', [
                Validators.required,
                Validators.pattern('^[1-9]\\d*')
            ])
        });
    };
    FillMachineComponent.prototype.ngAfterContentInit = function () {
    };
    FillMachineComponent.prototype.toggleState = function (field, rowId) {
        this.selectedField = field;
        this.selectedRowId = rowId;
        this.cellFormState = 'active';
        this.form.get('fieldInternalId').patchValue(field.internalId, { onlySelf: true });
        var productControl = this.form.get('product');
        var countControl = this.form.get('count');
        if (field.product != null) {
            var product = this.products.find(function (product) { return product.id === field.product.id; });
            productControl.patchValue(product);
            countControl.patchValue(field.count);
        }
        else {
            productControl.patchValue('');
            countControl.patchValue('');
        }
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.updateValueAndValidity();
        var rowElem = this.renderer.selectRootElement('#row' + rowId);
        if (rowElem.ownerDocument.body.clientWidth < 768) {
            var cellElement = this.domAdapter.querySelector(this.hostElement.nativeElement, '#cell' + field.internalId);
            this.renderer.attachViewAfter(cellElement, [this.cellFormElement.nativeElement]);
        }
        else {
            this.renderer.attachViewAfter(rowElem, [this.cellFormElement.nativeElement]);
        }
    };
    FillMachineComponent.prototype.applyCellFormState = function (rowId) {
        if (this.selectedField != null) {
            return 'active';
        }
        else {
            return 'inactive';
        }
    };
    FillMachineComponent.prototype.applyCardState = function (cardId) {
        if (this.selectedField && cardId === this.selectedField.internalId && this.cellFormState === 'active') {
            return 'active';
        }
        else {
            return 'inactive';
        }
    };
    FillMachineComponent.prototype.submit = function () {
        var fieldInternalId = this.form.get('fieldInternalId').value;
        var field = this.selectedField;
        field.internalId = fieldInternalId;
        field.product = this.form.get('product').value;
        field.count = this.form.get('count').value;
        this.changedFields.push(field);
        this.cancel();
    };
    FillMachineComponent.prototype.clearCell = function () {
        var fieldInternalId = this.form.get('fieldInternalId').value;
        var field = this.selectedField;
        field.internalId = fieldInternalId;
        field.product = null;
        field.count = 0;
        this.form.patchValue({
            field: field.internalId,
            product: '',
            count: ''
        });
        var changedField = this.changedFields.find(function (f) { return f.id === field.id; });
        if (changedField) {
            changedField = field;
        }
        else {
            this.changedFields.push(field);
        }
    };
    FillMachineComponent.prototype.cancel = function () {
        this.selectedRowId = -1;
        this.selectedField = null;
        this.cellFormState = 'inactive';
        this.form.reset();
    };
    FillMachineComponent.prototype.createImageUrl = function (product) {
        return AppProperties.API_VENDING_ENDPOINT + "/" + product.imageUrl;
    };
    FillMachineComponent.prototype.isClearCellDisabled = function () {
        return (this.selectedField && this.selectedField.product == null);
    };
    FillMachineComponent.prototype.isFormValid = function () {
        return !!(this.form.valid && !this.form.pristine);
    };
    FillMachineComponent.prototype.applyChanges = function () {
        var _this = this;
        this.machineService.fillMachine(this.machine)
            .subscribe(function (machine) {
            _this.changedFields = [];
            _this.machine = machine;
            _this.notificationService.success('Success', 'Machine filled successfully');
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
            finally {
                _this.clearCell();
            }
        });
    };
    FillMachineComponent.prototype.setClassIfProductAbsent = function (field) {
        if (field && field.product == null) {
            return " card-icon-centered";
        }
        else {
            return "";
        }
    };
    __decorate([
        ViewChild('cellForm'), 
        __metadata('design:type', ElementRef)
    ], FillMachineComponent.prototype, "cellFormElement", void 0);
    FillMachineComponent = __decorate([
        Component({
            selector: 'fill-machine',
            templateUrl: './fill-machine.component.html',
            styleUrls: ['./fill-machine.component.scss'],
            animations: [
                trigger('showHideForm', [
                    state('inactive', style({ display: 'none', opacity: 0 })),
                    state('active', style({ display: 'block', opacity: 1 })),
                    transition('inactive => active', animate('300ms ease-in')),
                    transition('active => inactive', animate('300ms ease-out')),
                ]),
                trigger('selectDeselectCard', [
                    state('inactive', style({
                        '-webkit-box-shadow': '0px 0px 0px 0px rgba(5,168,255,1)',
                        '-moz-box-shadow': '0px 0px 0px 0px rgba(5,168,255,1)',
                        'box-shadow': '0px 0px 0px 0px rgba(5,168,255,1)'
                    })),
                    state('active', style({
                        '-webkit-box-shadow': '0px 0px 25px 5px rgba(5,168,255,1)',
                        '-moz-box-shadow': '0px 0px 25px 5px rgba(5,168,255,1)',
                        'box-shadow': '0px 0px 25px 5px rgba(5,168,255,1)'
                    })),
                    transition('inactive => active', animate('200ms ease-in')),
                    transition('active => inactive', animate('200ms ease-out')),
                ])
            ]
        }), 
        __metadata('design:paramtypes', [MachineService, ProductService, ActivatedRoute, NotificationsService, Renderer, ElementRef])
    ], FillMachineComponent);
    return FillMachineComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/machines/fill-machine/fill-machine.component.js.map