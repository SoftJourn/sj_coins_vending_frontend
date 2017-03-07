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
import { AccountService } from "../services/account.service";
import { Router } from "@angular/router";
export var SideBarComponent = (function () {
    function SideBarComponent(accountService, router) {
        this.accountService = accountService;
        this.router = router;
        this.isActive = false;
        this.showMenu = '0';
        this.allowedRoutes = accountService.getRoutes();
    }
    SideBarComponent.prototype.ngOnInit = function () {
    };
    SideBarComponent.prototype.eventCalled = function () {
        this.isActive = !this.isActive;
    };
    SideBarComponent.prototype.addExpandClass = function (element) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        }
        else {
            this.showMenu = element;
        }
    };
    SideBarComponent.prototype.setSubmenuClass = function (element) {
        if (element === this.showMenu) {
            return 'expand';
        }
        else {
            return 'hide';
        }
    };
    SideBarComponent.prototype.isVisible = function (route) {
        return this.allowedRoutes.indexOf(route) != -1;
    };
    SideBarComponent.prototype.hide = function () {
        this.isActive = !this.isActive;
    };
    SideBarComponent.prototype.logout = function () {
        this.accountService.logout();
        this.router.navigate(['/login']);
    };
    SideBarComponent = __decorate([
        Component({
            selector: 'side-bar',
            templateUrl: './side-bar.component.html',
            styleUrls: ['./side-bar.component.scss']
        }), 
        __metadata('design:paramtypes', [AccountService, Router])
    ], SideBarComponent);
    return SideBarComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/side-bar/side-bar.component.js.map