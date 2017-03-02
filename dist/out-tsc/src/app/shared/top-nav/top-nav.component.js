var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { AccountService } from "../";
import { Router } from "@angular/router";
export var TopNavComponent = (function () {
    function TopNavComponent(accountService, router) {
        this.accountService = accountService;
        this.router = router;
    }
    TopNavComponent.prototype.ngOnInit = function () {
        this.account = this.accountService.getAccount();
    };
    TopNavComponent.prototype.logout = function () {
        this.accountService.logout();
        this.router.navigate(['/login']);
    };
    TopNavComponent = __decorate([
        Component({
            selector: 'top-nav',
            templateUrl: './top-nav.component.html',
            styleUrls: ['./top-nav.component.scss']
        }), 
        __metadata('design:paramtypes', [AccountService, Router])
    ], TopNavComponent);
    return TopNavComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/top-nav/top-nav.component.js.map