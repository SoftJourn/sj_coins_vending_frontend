var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, HostListener } from "@angular/core";
import { PurchaseService } from "../shared/services/purchase.service";
import { MachineService } from "../shared/services/machine.service";
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup } from "@angular/forms";
import { PurchaseFilter } from "../purchases/shared/purchase-filter";
import { PurchasePage } from "./shared/purchase-page";
import { NotificationsService } from "angular2-notifications/lib/notifications.service";
export var PurchasesComponent = (function () {
    // -------------------------------- init methods --------------------------------
    function PurchasesComponent(purchaseService, machineService, parser, notificationService) {
        this.purchaseService = purchaseService;
        this.machineService = machineService;
        this.parser = parser;
        this.notificationService = notificationService;
        // -------------------------------- functional variables --------------------------------
        this.page = new PurchasePage();
        // -------------------------------- functional variables --------------------------------
        this.hideFilter = true;
        this.hideStartDue = true;
        this.pageSize = 10;
        this.pageItems = 5;
        this.pageDirectionLinks = true;
        this.pageItemsSize = '';
        this.contentDefaultSize = 'col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6';
        this.contentFullSize = 'col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3';
        this.formDefaultSize = 'col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6';
        this.formFullSize = 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12';
    }
    PurchasesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.changeFormSize = this.formDefaultSize;
        this.changeContentSize = this.contentDefaultSize;
        this.buildForm();
        this.buildPageSizeForm();
        var filter = this.toPurchaseFilter(this.form);
        this.purchaseService.findAllByFilter(filter, 1, this.pageSize)
            .subscribe(function (page) {
            _this.page = page;
            _this.purchases = _this.page.content;
            _this.machineService.findAll().subscribe(function (machines) {
                _this.machines = machines;
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
        this.form.get('type').valueChanges.subscribe(function (change) {
            if (change === 'Start-Due') {
                _this.changeFormSize = _this.formFullSize;
                _this.changeContentSize = _this.contentFullSize;
                _this.inlineBlock = 'd-inline-block';
                _this.showStartDue();
            }
            else {
                _this.changeFormSize = _this.formDefaultSize;
                _this.changeContentSize = _this.contentDefaultSize;
                _this.inlineBlock = '';
                _this.toHideStartDue();
                _this.form.get('start').patchValue('');
                _this.form.get('due').patchValue('');
                _this.minDate = { year: 1900, month: 0, day: 1 };
                _this.maxDate = { year: 2099, month: 11, day: 31 };
            }
        });
        this.pageForm.get('pageSize').valueChanges.subscribe(function (change) {
            _this.pageSize = change;
            _this.fetch(1, _this.pageSize);
        });
    };
    // -------------------------------- ui methods --------------------------------
    PurchasesComponent.prototype.buildForm = function () {
        this.form = new FormGroup({
            machine: new FormControl('-1'),
            type: new FormControl('Any'),
            start: new FormControl(''),
            due: new FormControl('')
        });
    };
    PurchasesComponent.prototype.buildPageSizeForm = function () {
        this.pageForm = new FormGroup({
            pageSize: new FormControl('10')
        });
        if (window.innerWidth < 767) {
            this.pageItems = 3;
            this.pageItemsSize = 'sm';
            this.pageDirectionLinks = false;
        }
    };
    PurchasesComponent.prototype.onResize = function (event) {
        if (event.target.innerWidth > 767) {
            this.pageItems = 5;
            this.pageItemsSize = '';
            this.pageDirectionLinks = true;
        }
    };
    PurchasesComponent.prototype.showFilter = function () {
        this.hideFilter = !this.hideFilter;
    };
    PurchasesComponent.prototype.showStartDue = function () {
        this.hideStartDue = false;
    };
    PurchasesComponent.prototype.toHideStartDue = function () {
        this.hideStartDue = true;
    };
    // -------------------------------- functional methods --------------------------------
    PurchasesComponent.prototype.onSubmit = function () {
        if (this.form.get('type').value === 'Start-Due') {
            if (this.form.get('start').value == '' || this.form.get('due').value == '') {
                this.notificationService.error('Error', 'Please set start and due dates');
            }
            else {
                this.fetch(1, this.pageSize);
            }
        }
        else {
            this.fetch(1, this.pageSize);
        }
    };
    PurchasesComponent.prototype.onCancel = function () {
        this.form.get('machine').patchValue('-1');
        this.form.get('type').patchValue('Any');
        this.form.get('start').patchValue('');
        this.form.get('due').patchValue('');
        this.fetch(1, this.pageSize);
        this.showFilter();
    };
    PurchasesComponent.prototype.toPurchaseFilter = function (form) {
        var filter = new PurchaseFilter();
        filter.machineId = form.get('machine').value;
        filter.type = form.get('type').value;
        filter.timeZoneOffSet = new Date().getTimezoneOffset();
        filter.start = this.parser.format(form.get('start').value);
        filter.due = this.parser.format(form.get('due').value);
        return filter;
    };
    PurchasesComponent.prototype.changePage = function ($event) {
        if (this.form.get('type').value === 'Start-Due') {
            if (this.form.get('start').value == '' || this.form.get('due').value == '') {
                this.notificationService.error('Error', 'Please set start and due dates');
            }
            else {
                this.fetch($event, this.pageSize);
            }
        }
        else {
            this.fetch($event, this.pageSize);
        }
    };
    PurchasesComponent.prototype.changeStart = function ($event) {
        this.minDate = $event;
    };
    PurchasesComponent.prototype.changeDue = function ($event) {
        this.maxDate = $event;
    };
    PurchasesComponent.prototype.fetch = function (page, size) {
        var _this = this;
        var filter = this.toPurchaseFilter(this.form);
        this.purchaseService.findAllByFilter(filter, page, size)
            .subscribe(function (page) {
            _this.page = page;
            _this.purchases = _this.page.content;
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
    __decorate([
        HostListener('window:resize', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PurchasesComponent.prototype, "onResize", null);
    PurchasesComponent = __decorate([
        Component({
            selector: 'app-purchases',
            templateUrl: './purchases.component.html',
            styleUrls: ['./purchases.component.scss']
        }), 
        __metadata('design:paramtypes', [PurchaseService, MachineService, NgbDateParserFormatter, NotificationsService])
    ], PurchasesComponent);
    return PurchasesComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/purchases/purchases.component.js.map