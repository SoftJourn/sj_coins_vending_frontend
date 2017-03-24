import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {AppProperties} from "../app.properties";
import {Observable} from "rxjs";
import {Purchase} from "../entity/purchase";
import {PurchaseFilter} from "../../purchases/shared/purchase-filter";
import {Page} from "../entity/page";

@Injectable()
export class PurchaseService {

  constructor(protected httpService: HttpService) {
  }

  protected getUrl(): string {
    return `${AppProperties.API_VENDING_ENDPOINT}/purchases`;
  }

  public findAllByFilter(filter: PurchaseFilter, page: number, size: number): Observable<Page<Purchase>> {
    return this.httpService.post(this.getUrl() + '/filter?page=' + (page - 1) + '&size=' + size, filter).map(response => {
      return response.json()
    });
  }

}
