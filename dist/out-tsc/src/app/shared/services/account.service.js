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
import { Observable } from "rxjs/Rx";
import { TokenService } from "./token.service";
import { AppProperties } from "../app.properties";
import { AppError } from "../app-error";
import { Account } from "../entity/account";
import { HttpService } from "./http.service";
export var routes = {
    "ROLE_BILLING": ["/main/coins"],
    "ROLE_INVENTORY": ["/main", "/main/products", "/main/machines", "/main/categories"],
    "ROLE_USER_MANAGER": ["/main/users"],
    "ROLE_SUPER_ADMIN": ["/main/coins"]
        .concat(["/main/products", "/main/machines", "/main/categories"])
        .concat(["/main/products", "/main/machines", "/main/categories"])
        .concat(["/main/users"])
};
export var AccountService = (function () {
    function AccountService(tokenService, httpService) {
        this.tokenService = tokenService;
        this.httpService = httpService;
        this.STORAGE_KEY = 'account';
    }
    AccountService.prototype.createAccount = function (username) {
        var _this = this;
        return new Observable(function (observer) {
            var accountCreationError = new AppError('auth/creation-failure', 'Error appeared during account creation please try again later');
            var url = AppProperties.AUTH_API + "/users/" + username;
            _this.httpService.get(url).subscribe(function (response) {
                if (response.ok) {
                    var account = _this.createAccountFromJson(response.json());
                    observer.next(account);
                    observer.complete();
                }
                else {
                    observer.error(accountCreationError);
                }
            }, function (error) { return observer.error(accountCreationError); });
        });
    };
    AccountService.prototype.login = function (credentials) {
        var _this = this;
        return new Observable(function (observer) {
            _this.tokenService.deleteTokensFromStorage();
            var badCredError = new AppError('auth/account-not-found', 'Wrong credentials');
            if (AccountService.verifyCredentials(credentials)) {
                _this.tokenService.getAccessToken(credentials).subscribe(function (accessToken) { return _this.createAccount(credentials.username).subscribe(function (account) {
                    _this.account = account;
                    observer.complete();
                }, function (error) { return observer.error(error); }); }, function (error) { return observer.error(badCredError); });
            }
            else {
                observer.error(badCredError);
            }
        });
    };
    AccountService.prototype.logout = function () {
        this.tokenService.revokeRefreshToken().subscribe(function () { return null; }, function (error) { return null; });
        this.deleteAccountFromLocalStorage();
        this.tokenService.deleteTokensFromStorage();
    };
    AccountService.verifyCredentials = function (credentials) {
        var regExp = /^[\w!@#$%\^&*()\-\\.|\/?><;':"+=~`{}\[\],]+$/i;
        return regExp.test(credentials.username) && regExp.test(credentials.password);
    };
    AccountService.prototype.createAccountFromJson = function (user) {
        var account = new Account(user.ldapId, user.fullName, user.email, this.tokenService.authorities);
        localStorage.setItem(this.STORAGE_KEY, account.toString());
        return account;
    };
    AccountService.prototype.getAccount = function () {
        return new Account(JSON.parse(localStorage.getItem(this.STORAGE_KEY)));
    };
    AccountService.prototype.deleteAccountFromLocalStorage = function () {
        localStorage.removeItem(this.STORAGE_KEY);
        this.account = null;
    };
    AccountService.prototype.getRoutes = function () {
        var route = [];
        this.getAccount().authorities.forEach(function (a) { return route = routes[a.authority] ? route.concat(routes[a.authority]) : route; });
        //noinspection TypeScriptUnresolvedFunction
        return Array.from(new Set(route));
    };
    AccountService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [TokenService, HttpService])
    ], AccountService);
    return AccountService;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/account.service.js.map