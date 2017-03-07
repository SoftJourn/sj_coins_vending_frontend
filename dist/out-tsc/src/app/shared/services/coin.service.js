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
import { Observable } from "rxjs";
import { AppProperties } from "../app.properties";
import { AmountDto } from "../../coin-management/amount-dto";
import { MediaType } from "../media-type";
export var CoinService = (function () {
    function CoinService(httpService) {
        this.httpService = httpService;
    }
    CoinService.prototype.getAccountsByType = function (accountType) {
        var url = AppProperties.API_COINS_ENDPOINT + "/accounts/" + accountType.type;
        return this.httpService.get(url).map(function (response) { return response.json(); });
    };
    CoinService.prototype.getTreasuryAmount = function () {
        var url = AppProperties.API_COINS_ENDPOINT + "/amount/treasury";
        return this.httpService.get(url).map(function (response) { return response.json(); });
    };
    CoinService.prototype.getAmountByAccountType = function (accountType) {
        var url = AppProperties.API_COINS_ENDPOINT + "/amount/" + accountType.type;
        return this.httpService.get(url).map(function (response) { return response.json(); });
    };
    CoinService.prototype.getProductsPrice = function () {
        var url = AppProperties.API_VENDING_ENDPOINT + "/vending/price";
        return this.httpService.get(url).map(function (response) { return response.json(); });
    };
    CoinService.prototype.replenishAccounts = function (amount) {
        var url = AppProperties.API_COINS_ENDPOINT + "/distribute";
        var amountDto = new AmountDto(amount, 'Replenish accounts');
        return this.httpService.post(url, amountDto, MediaType.APPLICATION_JSON)
            .flatMap(function (response) { return Observable.empty(); });
    };
    CoinService.prototype.withdrawToTreasury = function (account) {
        var url = AppProperties.API_COINS_ENDPOINT + "/move/" + account.ldapId + "/treasury";
        var amountDto = new AmountDto(account.amount, "Withdraw " + account.amount + " coins to treasury from " + account.ldapId);
        return this.httpService.post(url, amountDto, MediaType.APPLICATION_JSON)
            .map(function (response) { return response.json(); });
    };
    CoinService.prototype.transferToAccount = function (transferDto) {
        var url = AppProperties.API_COINS_ENDPOINT + "/add/" + transferDto.account.ldapId;
        var amountDto = new AmountDto(transferDto.amount, "Filling account " + transferDto.account.ldapId + " by " + transferDto.amount + " coins");
        return this.httpService.post(url, amountDto, MediaType.APPLICATION_JSON)
            .map(function (response) { return response.json(); });
    };
    CoinService.prototype.transferToAccounts = function (transferFile) {
        var url = AppProperties.API_COINS_ENDPOINT + "/add/";
        return this.httpService.post(url, transferFile)
            .map(function (response) { return response.json(); });
    };
    CoinService.prototype.checkProcessing = function (checkHash) {
        var _this = this;
        var url = AppProperties.API_COINS_ENDPOINT + "/check/" + checkHash;
        var request = this.httpService.get(url)
            .map(function (response) { return response.json(); });
        return request.expand(function () { return Observable.timer(5000).concatMap(function () { return _this.httpService.get(url)
            .map(function (response) { return response.json(); }); }); });
    };
    CoinService.prototype.getTemplate = function () {
        var url = AppProperties.API_COINS_ENDPOINT + "/template";
        return this.httpService.get(url).map(function (response) {
            return new Blob([response.text()]);
        });
    };
    CoinService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [HttpService])
    ], CoinService);
    return CoinService;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/coin.service.js.map