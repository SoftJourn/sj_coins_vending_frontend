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
import { ActivatedRoute } from "@angular/router";
import { TransactionService } from "../../shared/services/transaction.service";
export var TransactionComponent = (function () {
    function TransactionComponent(route, transactionService) {
        this.route = route;
        this.transactionService = transactionService;
    }
    TransactionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.route.params.subscribe(function (params) {
            _this.transactionService.getById(params['id']).subscribe(function (response) {
                _this.transaction = response;
                _this.generalFields = Object.keys(_this.transaction).filter(function (key) {
                    if (key != "transactionStoring" && key != "id") {
                        return key;
                    }
                });
                if (_this.transaction["transactionStoring"]) {
                    _this.blockFields = Object.keys(_this.transaction.transactionStoring).filter(function (key) {
                        if (key != "transaction" && key != "callingValue" && key != "id")
                            return key;
                    });
                    _this.erisFields = Object.keys(_this.transaction.transactionStoring.transaction).filter(function (key) {
                        return key;
                    });
                    _this.callingFields = Object.keys(_this.transaction.transactionStoring.callingValue).filter(function (key) {
                        return key;
                    });
                }
            });
        });
    };
    TransactionComponent = __decorate([
        Component({
            selector: 'app-transaction',
            templateUrl: 'transaction.component.html',
            styleUrls: ['transaction.component.scss']
        }), 
        __metadata('design:paramtypes', [ActivatedRoute, TransactionService])
    ], TransactionComponent);
    return TransactionComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/transactions/transaction/transaction.component.js.map