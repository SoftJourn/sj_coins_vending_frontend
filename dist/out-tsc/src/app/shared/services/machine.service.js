var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
import { CrudService } from "./crud.service";
import { MediaType } from "../media-type";
export var MachineService = (function (_super) {
    __extends(MachineService, _super);
    function MachineService(httpService) {
        _super.call(this, httpService);
        this.httpService = httpService;
    }
    MachineService.prototype.getUrl = function () {
        return AppProperties.API_VENDING_ENDPOINT + "/vending";
    };
    MachineService.prototype.fillMachine = function (machine) {
        return this.httpService.put(this.getUrl(), machine, MediaType.APPLICATION_JSON)
            .map(function (response) { return response.json(); });
    };
    MachineService.prototype.updateMachine = function (machine) {
        var url = this.getUrl() + "/update";
        return this.httpService.put(url, machine, MediaType.APPLICATION_JSON)
            .map(function (response) { return response.json(); });
    };
    MachineService.prototype.resetMotorState = function (machine) {
        var url = this.getUrl() + "/" + machine.id + "/reset";
        return this.httpService.post(url, null, MediaType.APPLICATION_JSON);
    };
    MachineService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [HttpService])
    ], MachineService);
    return MachineService;
}(CrudService));
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/machine.service.js.map