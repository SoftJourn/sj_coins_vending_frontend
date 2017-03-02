import { async, TestBed } from '@angular/core/testing';
import { TransactionFilterItemComponent } from './transaction-filter-item.component';
describe('TransactionFilterItemComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [TransactionFilterItemComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(TransactionFilterItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/transaction-filter-item/transaction-filter-item.component.spec.js.map