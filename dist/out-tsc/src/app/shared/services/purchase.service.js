var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { AppProperties } from "../app.properties";
export var PurchaseService = (function () {
    function PurchaseService(httpService) {
        this.httpService = httpService;
    }
    PurchaseService.prototype.getUrl = function () {
        return AppProperties.API_VENDING_ENDPOINT + "/purchases";
    };
    PurchaseService.prototype.findAllByFilter = function (filter, page, size) {
        return this.httpService.post(this.getUrl() + '/filter?page=' + (page - 1) + '&size=' + size, filter).map(function (response) {
            return response.json();
        });
    };
    PurchaseService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [HttpService])
    ], PurchaseService);
    return PurchaseService;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/purchase.service.js.map