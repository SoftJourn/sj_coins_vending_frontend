import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {AppProperties} from "../app.properties";
import {Observable} from "rxjs";
import {Purchase} from "../entity/purchase";

@Injectable()
export class PurchaseService {

  constructor(protected httpService: HttpService) {
  }

  protected getUrl(): string {
    return `${AppProperties.API_VENDING_ENDPOINT}/purchases`;
  }

  public findAll(machinseId: number): Observable<Purchase[]> {
    return this.httpService.get(this.getUrl()+'/'+machinseId+'?page=0&size=10')
      .map(response => response.json());
  }

}
