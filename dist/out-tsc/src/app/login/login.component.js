var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppError } from "../shared/app-error";
import { AccountService } from "../shared/services/account.service";
import { NotificationsService } from "angular2-notifications";
export var LoginComponent = (function () {
    function LoginComponent(router, accountService, notificationService) {
        this.router = router;
        this.accountService = accountService;
        this.notificationService = notificationService;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.accountService.logout();
        this.loginError = new AppError();
        this.form = new FormGroup({
            username: new FormControl('', [
                Validators.required,
                Validators.pattern('[\\d\\w\\.]+')
            ]),
            password: new FormControl('', [
                Validators.required
            ])
        });
    };
    LoginComponent.prototype.isValidOrPristine = function (controlName) {
        return this.form.controls[controlName].valid
            || this.form.controls[controlName].pristine;
    };
    LoginComponent.prototype.inputDividerColor = function (controlName) {
        return this.isValidOrPristine(controlName) ? 'primary' : 'warn';
    };
    LoginComponent.prototype.errorMessage = function (controlName) {
        var control = this.form.controls[controlName];
        if (control.hasError('pattern')) {
            return 'Please enter valid LDAP login';
        }
        return 'This field is required';
    };
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        this.accountService.login(this.form.value)
            .subscribe(function () {
        }, function (error) { return _this.notificationService.error('Error', error.message); }, function () {
            if (!!_this.accountService.getRoutes()[0])
                _this.router.navigate([_this.accountService.getRoutes()[0]]);
            else
                _this.notificationService.info('Info', 'User is not admin');
        });
    };
    LoginComponent = __decorate([
        Component({
            selector: 'app-login',
            templateUrl: 'login.component.html',
            styleUrls: ['login.component.scss']
        }), 
        __metadata('design:paramtypes', [Router, AccountService, NotificationsService])
    ], LoginComponent);
    return LoginComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/login/login.component.js.map