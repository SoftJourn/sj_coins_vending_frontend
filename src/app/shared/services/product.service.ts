import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { Product } from "../entity/product";
import { AppProperties } from "../app.properties";
import { CrudService } from "./crud.service";

@Injectable()
export class ProductService extends CrudService<Product> {

  constructor(protected httpService: HttpService) {
    super(httpService);
  }

  protected getUrl(): string {
    return `${AppProperties.API_VENDING_ENDPOINT}/products`;
  }

  public findAllThatContainByName(name: string): Observable<Product[]> {
    return this.httpService.get(this.getUrl() + '/search?name=' + name).map(response => {
      return response.json();
    });
  }

  public updateImage(id: number, file: any): Observable<void> {
    let url = `${this.getUrl()}/${id}/image`;

    return this.httpService.post(url, file)
      .flatMap(response => Observable.empty())
  }
}
