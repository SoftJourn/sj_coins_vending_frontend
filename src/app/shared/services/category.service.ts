import { Injectable } from "@angular/core";
import { AppConsts } from "../app.consts";
import { Category } from "../entity/category";
import { Observable } from "rxjs/Observable";
import { AppError } from "../app-error";
import { HttpService } from "./http.service";

@Injectable()
export class CategoryService {

  constructor(private APP_CONSTS: AppConsts,
              private httpService: HttpService) {
  }

  public getCategories(): Observable<Category[]> {
    return new Observable<Category[]>(observer => {
      let url = `${this.APP_CONSTS.API_VENDING_ENDPOINT}/categories`;

      this.httpService.get(url).subscribe(
        response => {
          if (response.ok) {
            observer.next(<Category[]>response.json());
            observer.complete();
          }
        },
        error => observer.error(new AppError(
          'api/get-categories',
          'Error appeared during accessing categories, please try again later'))
      );
    });
  }

  public deleteCategory(id: number): Observable<void> {
    return new Observable<void>(observer => {
      let url = `${this.APP_CONSTS.API_VENDING_ENDPOINT}/categories/${id}`;

      this.httpService.delete(url).subscribe(
        response => {
          if (response.ok) {
            observer.complete();
          }
        },
        error => observer.error(new AppError(
          'api/delete-category',
          'Error appeared during deleting category, please try again later'))
      );
    });
  }

  public createCategory(category: Category): Observable<Category> {
    return new Observable<Category>(observer => {
      let url = `${this.APP_CONSTS.API_VENDING_ENDPOINT}/categories`;
      let contentType = 'application/json';

      this.httpService.post(url, category, contentType).subscribe(
        response => {
          if (response.ok) {
            observer.next(response.json());
            observer.complete();
          }
        },
        error => observer.error(new AppError(
          'api/create-category',
          'Error appeared during category creation, please try again later'))
      );
    });
  }

}
