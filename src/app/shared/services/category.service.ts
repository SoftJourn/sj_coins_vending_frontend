import { Injectable } from "@angular/core";
import { AppProperties } from "../app.properties";
import { Category } from "../entity/category";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";

@Injectable()
export class CategoryService extends CrudService<Category> {

  constructor(protected httpService: HttpService) {
    super(httpService);
  }

  protected getUrl(): string {
    return `${AppProperties.API_VENDING_ENDPOINT}/categories`;
  }

}
