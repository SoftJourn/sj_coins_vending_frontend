/* tslint:disable:no-unused-variable */
import { describe, expect, it, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AccountService } from "../shared/";
describe('Component: Login', function () {
    it('should create an instance', inject([Router, AccountService], function (router, account) {
        var component = new LoginComponent(router, account);
        expect(component).toBeTruthy();
    }));
});
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/login/login.component.spec.js.map