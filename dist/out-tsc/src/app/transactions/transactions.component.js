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
import { Transaction } from "../shared/entity/transaction";
import { Router } from "@angular/router";
export var TransactionsComponent = (function () {
    function TransactionsComponent(transactionService, router) {
        this.transactionService = transactionService;
        this.router = router;
        this.hideFilter = true;
        this.pageSize = 10;
        this.pageItems = 5;
        this.pageDirectionLinks = true;
        this.pageItemsSize = '';
    }
    TransactionsComponent.prototype.ngOnInit = function () {
        this.buildPageSizeForm();
        this.buildFilterForm();
        this.fetch(1, this.pageSize);
        this.fields = new Array();
        // just for getting field names
        var transaction = new Transaction(1, '', '', 1, '', '', '', '');
        this.fields = Object.keys(transaction).filter(function (key) {
            if (key != "id" && key != "remain") {
                return key;
            }
        });
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
            value: new FormControl('', Validators.required),
            comparison: new FormControl('', Validators.required)
        }));
        this.filterForm.controls[this.filterForm.controls.length - 1].get('field').patchValue(this.fields[0]);
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
        var values = formArray.value;
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
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
        var pageable = new Pageable(this.sorts);
        return new TransactionPageRequest(conditions, pageable);
    };
    TransactionsComponent.prototype.fetch = function (page, size) {
        var _this = this;
        var filter = this.toTransactionFilter(this.filterForm);
        filter.pageable.page = page - 1;
        filter.pageable.size = size;
        this.transactionService.get(filter).subscribe(function (response) {
            _this.page = response;
        }, function (error) {
            console.error(error);
        });
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
        __metadata('design:paramtypes', [TransactionService, Router])
    ], TransactionsComponent);
    return TransactionsComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/transactions/transactions.component.js.map