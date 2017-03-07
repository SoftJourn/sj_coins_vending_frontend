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
import { CrudService } from "./crud.service";
import { HttpService } from "./http.service";
import { AppProperties } from "../app.properties";
import { Account } from "../entity/account";
export var LdapUsersService = (function (_super) {
    __extends(LdapUsersService, _super);
    function LdapUsersService(httpService) {
        _super.call(this, httpService, Account.prototype);
        this.httpService = httpService;
    }
    LdapUsersService.prototype.getUrl = function () {
        return AppProperties.AUTH_API + "/users";
    };
    LdapUsersService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [HttpService])
    ], LdapUsersService);
    return LdapUsersService;
}(CrudService));
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/ldap.users.service.js.map