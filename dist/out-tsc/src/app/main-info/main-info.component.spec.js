/* tslint:disable:no-unused-variable */
import { MainInfoComponent } from './main-info.component';
import { AccountService } from "../shared/services/account.service";
import { inject } from "@angular/core/testing";
describe('Component: MainInfo', function () {
    it('should create an instance', inject([AccountService], function (account, taskService) {
        var component = new MainInfoComponent(account, taskService);
        expect(component).toBeTruthy();
    }));
});
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/main-info/main-info.component.spec.js.map