/* tslint:disable:no-unused-variable */
import { Account } from './account';
import { AccountPhoto } from "./";
describe('Account', function () {
    it('should create an instance', function () {
        expect(new Account(1, 'Andy Bob', 'ab@gm.com', new AccountPhoto(1, 'someurl', 'test.jpg', 80, 80))).toBeTruthy();
    });
});
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/entity/account.spec.js.map