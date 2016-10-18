import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {AppProperties} from "../app.properties";
import {Observable} from "rxjs";
import {Purchase} from "../entity/purchase";
import {PurchaseFilter} from "../../purchases/shared/purchase-filter";
import {PurchasePage} from "../../purchases/shared/purchase-page";

@Injectable()
export class PurchaseService {

  constructor(protected httpService: HttpService) {
  }

  protected getUrl(): string {
    return `${AppProperties.API_VENDING_ENDPOINT}/purchases`;
  }

  public findAll(): Observable<Purchase[]> {
    return this.httpService.get(this.getUrl() + '?page=0&size=10')
      .map(response => response.json());
  }

  public findAllByFilter(filter: PurchaseFilter, page: number, size: number): Observable<PurchasePage> {
    return this.httpService.post(this.getUrl() + '/filter?page=' + (page - 1) + '&size=' + size, filter).map(response => {
      return response.json()
    });
  }

}
