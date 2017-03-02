var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TransactionService } from "../shared/services/transaction.service";
export var TransactionFilterItemComponent = (function () {
    function TransactionFilterItemComponent(transactionService) {
        this.transactionService = transactionService;
    }
    TransactionFilterItemComponent.prototype.ngOnInit = function () {
    };
    TransactionFilterItemComponent.prototype.changeField = function () {
        this.filter.get("value").patchValue("");
        this.filter.get('comparison').patchValue("eq");
    };
    TransactionFilterItemComponent.prototype.addWhileInclude = function (e) {
        var inputs;
        if (this.filter.get("value").value == "") {
            inputs = new Set();
        }
        else {
            inputs = new Set(this.filter.get("value").value);
        }
        inputs.add(e);
        this.filter.get("value").patchValue(Array.from(inputs));
    };
    TransactionFilterItemComponent.prototype.removeWhileInclude = function (e) {
        var inputs = new Set(this.filter.get("value").value);
        inputs.delete(e);
        this.filter.get("value").patchValue(Array.from(inputs));
    };
    __decorate([
        Input('fields'), 
        __metadata('design:type', String)
    ], TransactionFilterItemComponent.prototype, "fields", void 0);
    __decorate([
        Input('formGroup'), 
        __metadata('design:type', FormGroup)
    ], TransactionFilterItemComponent.prototype, "filter", void 0);
    TransactionFilterItemComponent = __decorate([
        Component({
            selector: 'app-transaction-filter-item',
            templateUrl: './transaction-filter-item.component.html',
            styleUrls: ['./transaction-filter-item.component.scss']
        }), 
        __metadata('design:paramtypes', [TransactionService])
    ], TransactionFilterItemComponent);
    return TransactionFilterItemComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/transaction-filter-item/transaction-filter-item.component.js.map