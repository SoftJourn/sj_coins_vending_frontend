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
import { TransactionService } from "../shared/services/transaction.service";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Condition } from "./condition";
import { Pageable } from "./pageable";
import { TransactionPageRequest } from "./transaction-page-request";
import { Sort } from "./sort";
import { Router } from "@angular/router";
import { NotificationsService } from "angular2-notifications";
export var TransactionsComponent = (function () {
    function TransactionsComponent(transactionService, router, notificationService) {
        this.transactionService = transactionService;
        this.router = router;
        this.notificationService = notificationService;
        this.hideFilter = true;
        this.pageSize = 10;
        this.pageItems = 5;
        this.pageDirectionLinks = true;
        this.pageItemsSize = '';
    }
    TransactionsComponent.prototype.ngOnInit = function () {
        this.buildPageSizeForm();
        this.fetch(1, this.pageSize);
        this.buildFilterForm();
        var distinctFields = new Set();
        this.data = {
            account: {
                ldapId: "text",
                amount: "number",
                erisAccount: {
                    address: "text",
                    pubKey: "text",
                    type: "text"
                }
            },
            destination: {
                ldapId: "text",
                amount: "number",
                erisAccount: {
                    address: "text",
                    pubKey: "text",
                    type: "text"
                }
            },
            erisTransactionId: "text",
            amount: "number",
            comment: "text",
            status: "text",
            error: "text",
            created: "date",
        };
        Object.keys(this.data).forEach(function (key) {
            if (key != "id" && key != "remain" && key != "erisTransactionId") {
                distinctFields.add(key);
            }
        });
        this.fields = Array.from(distinctFields);
        this.addFilter();
    };
    TransactionsComponent.prototype.buildPageSizeForm = function () {
        var _this = this;
        this.pageForm = new FormGroup({
            pageSize: new FormControl('10')
        });
        if (window.innerWidth <= 800) {
            this.pageItems = 3;
            this.pageItemsSize = 'sm';
            this.pageDirectionLinks = true;
        }
        this.pageForm.get('pageSize').valueChanges.subscribe(function (change) {
            _this.pageSize = change;
            _this.fetch(1, _this.pageSize);
        });
    };
    TransactionsComponent.prototype.buildFilterForm = function () {
        this.filterForm = new FormArray([]);
    };
    TransactionsComponent.prototype.addFilter = function () {
        this.filterForm.push(new FormGroup({
            field: new FormControl('', Validators.required),
            value: new FormControl('', [Validators.required, Validators.nullValidator]),
            comparison: new FormControl('', Validators.required)
        }));
        this.filterForm.controls[this.filterForm.controls.length - 1].get('field').patchValue(this.fields[this.fields.length - 1]);
        this.filterForm.controls[this.filterForm.controls.length - 1].get('comparison').patchValue("eq");
    };
    TransactionsComponent.prototype.onSubmit = function () {
        this.fetch(1, this.pageSize);
    };
    TransactionsComponent.prototype.onCancel = function () {
        this.filterForm.controls = [];
        this.addFilter();
        this.fetch(1, this.pageSize);
    };
    TransactionsComponent.prototype.onResize = function (event) {
        if (event.target.innerWidth > 800) {
            this.pageItems = 5;
            this.pageItemsSize = '';
            this.pageDirectionLinks = true;
        }
    };
    TransactionsComponent.prototype.showFilter = function () {
        this.hideFilter = !this.hideFilter;
    };
    TransactionsComponent.prototype.openTransaction = function (id) {
        this.router.navigate(['/main/transactions/' + id]);
    };
    TransactionsComponent.prototype.changePage = function (number) {
        this.fetch(number, this.pageSize);
    };
    TransactionsComponent.prototype.setSortClass = function (column) {
        if (!this.sorts) {
            this.sorts = new Array();
        }
        var sort = this.sorts.filter(function (sort) { return sort.property == column; });
        if (sort.length < 1) {
            return "fa fa-sort";
        }
        else if (sort[0].direction == "ASC") {
            return "fa fa-sort-asc";
        }
        else if (sort[0].direction == "DESC") {
            return "fa fa-sort-desc";
        }
    };
    TransactionsComponent.prototype.setSorting = function (column) {
        if (!this.sorts) {
            this.sorts = new Array();
        }
        var sort = this.sorts.filter(function (sort) { return sort.property == column; });
        if (sort.length < 1) {
            this.sorts.push(new Sort("ASC", column));
        }
        else if (sort[0].direction == "ASC") {
            sort[0].direction = "DESC";
        }
        else {
            this.sorts.splice(this.sorts.indexOf(sort[0], 0), 1);
        }
        this.fetch(1, this.pageSize);
    };
    TransactionsComponent.prototype.toTransactionFilter = function (formArray) {
        var conditions = new Array();
        if (formArray) {
            for (var _i = 0, _a = formArray.value; _i < _a.length; _i++) {
                var value = _a[_i];
                if (value["value"] != "") {
                    if (this.transactionService.getType(value["field"]) == "date") {
                        conditions.push(new Condition(value["field"], new Date(value["value"]).toISOString(), value["comparison"]));
                    }
                    else if (this.transactionService.getType(value["field"]) == "number" && Array.isArray(value["field"])) {
                        conditions.push(new Condition(value["field"], value["value"].map(function (item) {
                            return parseInt(item);
                        }), value["comparison"]));
                    }
                    else {
                        conditions.push(new Condition(value["field"], value["value"], value["comparison"]));
                    }
                }
            }
        }
        var pageable = new Pageable(this.sorts);
        return new TransactionPageRequest(conditions, pageable);
    };
    TransactionsComponent.prototype.validateInclude = function (formArray) {
        if (formArray) {
            for (var _i = 0, _a = formArray.value; _i < _a.length; _i++) {
                var value = _a[_i];
                if (this.transactionService.getType(value["field"]) == "number" && value["comparison"] == "in") {
                    for (var _b = 0, _c = value["value"]; _b < _c.length; _b++) {
                        var number = _c[_b];
                        if (isNaN(number)) {
                            throw new Error("Field " + value["field"] + "does not belong to type number");
                        }
                    }
                }
            }
        }
    };
    TransactionsComponent.prototype.fetch = function (page, size) {
        var _this = this;
        var filter;
        try {
            this.validateInclude(this.filterForm);
            filter = this.toTransactionFilter(this.filterForm);
            filter.pageable.page = page - 1;
            filter.pageable.size = size;
            this.transactionService.get(filter).subscribe(function (response) {
                _this.page = response;
            }, function (error) {
                _this.notificationService.error("Error", error.detail);
            });
        }
        catch (error) {
            this.notificationService.error("Error", error.message);
        }
    };
    __decorate([
        HostListener('window:resize', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], TransactionsComponent.prototype, "onResize", null);
    TransactionsComponent = __decorate([
        Component({
            selector: 'app-transactions',
            templateUrl: './transactions.component.html',
            styleUrls: ['./transactions.component.scss']
        }), 
        __metadata('design:paramtypes', [TransactionService, Router, NotificationsService])
    ], TransactionsComponent);
    return TransactionsComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/transactions/transactions.component.js.map