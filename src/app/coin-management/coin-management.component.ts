import { Component, OnInit } from '@angular/core';
import { CoinsAccount, REGULAR, MERCHANT } from "./coins-account";
import { CoinService } from "../shared/services/coin.service";
import { NotificationsService } from "angular2-notifications";
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

  accounts: CoinsAccount[];

  constructor(
    private coinService: CoinService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit() {
    this.coinService.getAccountsByType(REGULAR)
      .subscribe(
        accounts => this.accounts = accounts,
        error => this.notificationService.error('Error', 'Error appeared during load accounts')
      );

    this.coinService.getTreasuryAmount()
      .subscribe(
        amountDto => this.treasuryAmount = amountDto.amount,
        error => this.notificationService.error('Error', 'Error appeared during load treasury amount')
      );

    this.coinService.getAmountByAccountType(REGULAR)
      .subscribe(
        amountDto => this.accountsAmount = amountDto.amount,
        error => this.notificationService.error('Error', 'Error appeared during load accounts amount')
      );

    this.coinService.getAmountByAccountType(MERCHANT)
      .subscribe(
        amountDto => this.merchantsAmount = amountDto.amount,
        error => this.notificationService.error('Error', 'Error appeared during load merchants amount')
      );

    this.coinService.getProductsPrice()
      .subscribe(
        amountDto => this.productsPrice = amountDto.amount,
        error => this.notificationService.error('Error', 'Error appeared during load products amount')
      );
  }

}
