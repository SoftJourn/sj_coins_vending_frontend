import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {
  AccountType,
  CoinsAccount
} from "../../coin-management/coins-account";
import {Observable} from "rxjs";
import {AppProperties} from "../app.properties";
import {AmountDto} from "../../coin-management/amount-dto";
import {Transaction} from "../../coin-management/transaction";
import {MediaType} from "../media-type";
import {ResultDTO} from "../../coin-management/result-dto";
import {CheckDTO} from "../../coin-management/check-dto";

@Injectable()
export class CoinService {

  constructor(protected httpService: HttpService) {
  }

  public getAccountsByType(accountType: AccountType): Observable<CoinsAccount[]> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/accounts/${accountType.type}`;

    return this.httpService.get(url).map(response => response.json());
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

  public replenishAccounts(amount: number): Observable<void> {
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

  public transferToAccount(transferDto: {account: CoinsAccount, amount: number}): Observable<Transaction> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/add/${transferDto.account.ldapId}`;
    let amountDto = new AmountDto(
      transferDto.amount,
      `Filling account ${transferDto.account.ldapId} by ${transferDto.amount} coins`);

    return this.httpService.post(url, amountDto, MediaType.APPLICATION_JSON)
      .map(response => response.json());
  }

  public transferToAccounts(transferFile: any): Observable<ResultDTO> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/add/`;
    return this.httpService.post(url, transferFile)
      .map(response => response.json());
  }

  public checkProcessing(checkHash: string): Observable<CheckDTO> {
    let url = `${AppProperties.API_COINS_ENDPOINT}/check/${checkHash}`;
    let request = this.httpService.get(url)
      .map(response => response.json());
    return request.expand(() => Observable.timer(5000).concatMap(() => this.httpService.get(url)
      .map(response => response.json())));
  }

}
