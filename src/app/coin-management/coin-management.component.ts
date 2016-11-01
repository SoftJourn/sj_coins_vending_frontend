import { Component, OnInit } from "@angular/core";
import { CoinsAccount, REGULAR, MERCHANT } from "./coins-account";
import { CoinService } from "../shared/services/coin.service";
import { NotificationsService } from "angular2-notifications";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FormValidationStyles } from "../shared/form-validation-styles";
import { Observable } from "rxjs";
import { AmountDto } from "./amount-dto";

@Component({
  selector: 'app-coin-management',
  templateUrl: './coin-management.component.html',
  styleUrls: ['./coin-management.component.scss']
})
export class CoinManagementComponent implements OnInit {
  treasuryAmount: number;
  productsPrice: number;
  merchantsAmount: number;
  accountsAmount: number;

  regularAccounts: CoinsAccount[];
  merchantAccounts: CoinsAccount[];

  replenishForm: FormGroup;
  withdrawForm: FormGroup;
  transferForm: FormGroup;

  withdrawBtnState = true;

  replenishFormStyles: FormValidationStyles;
  transferFormStyles: FormValidationStyles;

  constructor(
    private coinService: CoinService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit() {
    this.buildForms();
    this.loadData();
  }

  private buildForms(): void {
    this.replenishForm = new FormGroup({
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern('\\d+')
      ])
    });

    this.replenishFormStyles = new FormValidationStyles(this.replenishForm);

    this.withdrawForm = new FormGroup({
      merchant: new FormControl('', Validators.required)
    });

    this.withdrawForm.get('merchant').valueChanges
      .subscribe(
        (account: CoinsAccount) => this.withdrawBtnState = this.isSubmitButtonEnabled(account.amount, this.withdrawForm)
      );

    this.transferForm = new FormGroup({
      account: new FormControl('', Validators.required),
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern('\\d+')
      ])
    });

    this.transferFormStyles = new FormValidationStyles(this.transferForm);
  }

  private loadData(): void {
    this.coinService.getAccountsByType(REGULAR)
      .flatMap(accounts => {
        this.regularAccounts = accounts;
        this.accountsAmount = this.regularAccounts.reduce((prev, curr) => prev + curr.amount, 0);
        this.transferForm.get('account').patchValue(this.regularAccounts[0], {onlySelf: true});

        return this.coinService.getAccountsByType(MERCHANT);
      })
      .flatMap(accounts => {
        this.merchantAccounts = accounts;
        this.merchantsAmount = this.merchantAccounts.reduce((prev, curr) => prev + curr.amount, 0);
        this.withdrawForm.get('merchant').patchValue(this.merchantAccounts[0]);
        this.withdrawBtnState = !(this.merchantAccounts[0].amount > 0 && this.withdrawForm.value);

        return this.coinService.getTreasuryAmount();
      })
      .subscribe(
        (amountDto: AmountDto) => {
          this.treasuryAmount = amountDto.amount;
        },
        error => this.notificationService.error('Error', 'Error appeared during loading data from coins server')
      );

    this.coinService.getProductsPrice()
      .subscribe(
        amountDto => this.productsPrice = amountDto.amount,
        error => this.notificationService.error('Error', 'Error appeared during load products amount')
      );
  }

  isSubmitButtonEnabled(checkAmount: number, form: FormGroup): boolean {
    if (checkAmount > 0) {
      return !this.isFormValid(form);
    } else {
      return true;
    }
  }

  private isFormValid(form: FormGroup): boolean {
    return !!(form.valid && !form.pristine);
  }

  replenishAccounts(): void {
    this.coinService.replenishAccounts(this.replenishForm.value['amount'])
      .subscribe(
        () => null,
        error => this.notificationService.error('Error', 'Error appeared during replenish accounts'),
        () => {
          this.notificationService.success('Success', 'Accounts has been replenished successfully.');
          this.loadData();
        }
      );

    this.replenishForm.reset({amount: ''});
  }

  withdrawToTreasury() {
    this.coinService.withdrawToTreasury(this.withdrawForm.value['merchant'])
      .subscribe(
        transaction => {
          if (transaction.status.toLowerCase() == 'success') {
            this.notificationService.success(
              'Success', `Money from ${transaction.account} has been withdrawn successfully`
            );
            this.loadData();
          } else {
            this.notificationService.error('Error', transaction.error);
          }
        },
        error => this.notificationService.error('Error', 'Error appeared during withdrawal')
      );

    this.withdrawForm.reset({merchant: this.merchantAccounts[0]});
  }

  transferToAccount(): void {
    this.coinService.transferToAccount(this.transferForm.value)
      .subscribe(
        transaction => {
          if (transaction.status.toLowerCase() == 'success') {
            this.notificationService.success('Success', 'Money has been transferred successfully');
            this.loadData();
          } else {
            this.notificationService.error('Error', transaction.error);
          }
        },
        error => this.notificationService.error('Error', 'Error appeared during money transferring')
      );

    this.transferForm.reset({
      account: this.regularAccounts[0],
      amount: ''
    });
  }
}