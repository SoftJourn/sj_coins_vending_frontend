import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {Observable} from "rxjs";
import {Transaction} from "../entity/transaction";
import {AppProperties} from "../app.properties";
import {TransactionPageRequest} from "../../transactions/transaction-page-request";
import {FullTransaction} from "../entity/full-transaction";
import {Page} from "../entity/page";

@Injectable()
export class TransactionService {

  protected getUrl(): string {
    return `${AppProperties.API_COINS_ENDPOINT}/transactions`;
  }

  constructor(private httpService: HttpService) {
  }

  public get(transactionPageRequest: TransactionPageRequest): Observable<Page<Transaction>> {
    return this.httpService.post(this.getUrl(), transactionPageRequest).map(response => response.json());
  }

  public getFilterData(): Observable<Object> {
    return this.httpService.get(this.getUrl() + "/filter").map(response => response.json());
  }

  public filterAutocompleteData(fieldToAutocomplete: string): Observable<string[]> {
    return this.httpService.get(this.getUrl() + "/filter/autocomplete?field=" + fieldToAutocomplete)
      .map(response => {
        return response.json()
      });
  }

  public getById(id: number): Observable<FullTransaction> {
    return this.httpService.get(this.getUrl() + "/" + id).map(response => response.json());
  }

  public getType(object: any, field: string): string {
    let fields = field.split('.');
    for (let i = 0; i < fields.length; i++) {
      object = object[fields[i]];
    }
    return object;
  }

  public isDateType(datetime: any): boolean {
    if (typeof datetime == "number") {
      return false;
    } else return !isNaN(Date.parse(datetime));
  }


}
