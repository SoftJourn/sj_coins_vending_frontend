import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { AccountType, CoinsAccount } from "../../coin-management/coins-account";
import { Observable } from "rxjs";
import { AppProperties } from "../app.properties";
import { AmountDto } from "../../coin-management/amount-dto";

@Injectable()
export class CoinService {

  constructor(protected httpService: HttpService) {}

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
}
