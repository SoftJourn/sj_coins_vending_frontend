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
import { Router } from "@angular/router";
import { AccountService } from "./shared/";
export var routingGuardMap = {
    "ROLE_SUPER_ADMIN": new RegExp(".*"),
    "ROLE_BILLING": new RegExp("/main/coins"),
    "ROLE_INVENTORY": new RegExp("^/main$|/main/products|/main/machines|/main/categories|/main/purchases"),
    "ROLE_USER_MANAGER": new RegExp("/main/users")
};
export var AuthGuard = (function () {
    function AuthGuard(router, accountService) {
        this.router = router;
        this.accountService = accountService;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var account = this.accountService.getAccount();
        if (account && account.authorities) {
            return !!account.authorities.some(function (a) { return routingGuardMap[a.authority] ? routingGuardMap[a.authority].test(state.url) : false; });
        }
        else {
            this.router.navigate(['/login']);
            return false;
        }
    };
    AuthGuard = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Router, AccountService])
    ], AuthGuard);
    return AuthGuard;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/auth.guard.js.map