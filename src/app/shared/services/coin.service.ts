import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {AccountType, CoinsAccount} from '../../coin-management/coins-account';
import {Observable} from 'rxjs';
import {AppProperties} from '../app.properties';
import {AmountDto} from '../../coin-management/amount-dto';
import {Transaction} from '../../coin-management/transaction';
import {MediaType} from '../media-type';
import {Response} from '@angular/http';
import {Page} from '../entity/page';
import {Pageable} from '../entity/pageable';
import {AccountDTO} from '../dto/account-dto';

@Injectable()
export class CoinService {

  constructor(protected httpService: HttpService) {
  }

  public getAccountsByType(accountType: AccountType): Observable<CoinsAccount[]> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/accounts/${accountType.type}`;

    return this.httpService.get(url).map(response => response.json());
  }

  public getAccounts(pageable: Pageable): Observable<Page<AccountDTO>> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/accounts/pages?page=${pageable.page}&size=${pageable.size}`;
    return this.httpService.get(url).map(response => {
      return response.json();
    });
  }

  public searchByAccounts(value: string, pageable: Pageable): Observable<Page<AccountDTO>> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/accounts/search?value=${value}&page=${pageable.page}&size=${pageable.size}`;
    return this.httpService.get(url).map(response => response.json());
  }

  public deleteAccount(ldapId: string): Observable<{}> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/account/${ldapId}`;
    return this.httpService.delete(url).flatMap(() => Observable.empty());
  }

  public getTreasuryAmount(): Observable<AmountDto> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/amount/treasury`;

    return this.httpService.get(url).map(response => response.json());
  }

  public getAmountByAccountType(accountType: AccountType): Observable<AmountDto> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/amount/${accountType.type}`;

    return this.httpService.get(url).map(response => response.json());
  }

  public getProductsPrice(): Observable<AmountDto> {
    let url = `${AppProperties.API_VENDING_ENDPOINT}/vending/price`;

    return this.httpService.get(url).map(response => response.json());
  }

  public replenishAccounts(amount: number): Observable<{}> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/distribute`;
    let amountDto = new AmountDto(amount, 'Replenish accounts');

    return this.httpService.post(url, amountDto, MediaType.APPLICATION_JSON)
      .flatMap(response => Observable.empty());
  }

  public withdrawToTreasury(account: CoinsAccount): Observable<Transaction> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/move/${account.ldapId}/treasury`;
    let amountDto = new AmountDto(
      account.amount,
      `Withdraw ${account.amount} coins to treasury from ${account.ldapId}`);

    return this.httpService.post(url, amountDto, MediaType.APPLICATION_JSON)
      .map(response => response.json());
  }

  public transferToAccount(transferDto: { account: CoinsAccount, amount: number }): Observable<Transaction> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/add/${transferDto.account.ldapId}`;
    let amountDto = new AmountDto(
      transferDto.amount,
      `Filling account ${transferDto.account.ldapId} by ${transferDto.amount} coins`);

    return this.httpService.post(url, amountDto, MediaType.APPLICATION_JSON)
      .map(response => response.json());
  }

  public transferToAccounts(transferFile: any): Observable<any> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/add/`;
    return this.httpService.post(url, transferFile);
  }

  public getTemplate(): Observable<Blob> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/template`;
    return this.httpService.get(url).map((response: Response) => {
      return new Blob([response.text()]);
    });
  }

}
