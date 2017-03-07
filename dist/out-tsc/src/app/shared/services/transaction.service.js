var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { AppProperties } from "../app.properties";
export var TransactionService = (function () {
    function TransactionService(httpService) {
        this.httpService = httpService;
    }
    TransactionService.prototype.getUrl = function () {
        return AppProperties.API_COINS_ENDPOINT + "/transactions";
    };
    TransactionService.prototype.get = function (transactionPageRequest) {
        return this.httpService.post(this.getUrl(), transactionPageRequest).map(function (response) { return response.json(); });
    };
    TransactionService.prototype.getById = function (id) {
        return this.httpService.get(this.getUrl() + "/" + id).map(function (response) { return response.json(); });
    };
    TransactionService.prototype.getType = function (field) {
        var type;
        switch (field) {
            case 'account':
            case 'destination':
            case 'comment':
            case 'status':
            case 'error':
                type = "text";
                break;
            case 'amount':
                type = "number";
                break;
            case 'created':
            case 'time':
                type = "date";
                break;
        }
        return type;
    };
    TransactionService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [HttpService])
    ], TransactionService);
    return TransactionService;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/transaction.service.js.map