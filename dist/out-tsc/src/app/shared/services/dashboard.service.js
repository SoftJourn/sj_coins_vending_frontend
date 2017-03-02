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
import { AppProperties } from "../app.properties";
import { HttpService } from "./http.service";
export var DashboardService = (function () {
    function DashboardService(httpService) {
        this.httpService = httpService;
    }
    DashboardService.prototype.getDashboard = function () {
        var url = AppProperties.API_VENDING_ENDPOINT + "/dashboard";
        return this.httpService.get(url)
            .map(function (response) { return response.json(); });
    };
    DashboardService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [HttpService])
    ], DashboardService);
    return DashboardService;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/dashboard.service.js.map