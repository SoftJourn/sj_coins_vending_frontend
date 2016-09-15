import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {AppConsts} from "../app.consts";
import {AccountService} from "./account.service";
import {Category} from "../entity/category";
import {Observable} from "rxjs/Observable";
import {AppError} from "../app-error";

@Injectable()
export class CategoryService {

  constructor(private APP_CONSTS: AppConsts,
              private accountService: AccountService,
              private http: Http) {
  }

  public getCategories(): Observable<Category[]> {
    return new Observable<Category[]>(observer => {
      let url = `${this.APP_CONSTS.API_VENDING_ENDPOINT}/categories`;
      this.accountService.getHeaders()
        .flatMap(headers => this.http.get(url, {headers: headers}))
        .subscribe(
          response => {
            if (response.ok) {
              observer.next(<Category[]>response.json());
              observer.complete();
            }
          },
          error => observer.error(new AppError(
            'auth/creation-failure',
            'Error appeared during account creation please try again later'))
        );
    });
  }

  public deleteCategory(id: number): Observable<void> {
    return new Observable<void>(observer => {
      let url = `${this.APP_CONSTS.API_VENDING_ENDPOINT}/categories/` + id;
      this.accountService.getHeaders()
        .flatMap(headers => this.http.delete(url, {headers: headers}))
        .subscribe(
          response => {
            if (response.ok) {
              observer.complete();
            }
          },
          error => observer.error(new AppError(
            'auth/creation-failure',
            'Error appeared during account creation please try again later'))
        );
    });
  }

  public createCategory(category: Category): Observable<Category> {
    return new Observable<Category>(observer => {
      let url = `${this.APP_CONSTS.API_VENDING_ENDPOINT}/categories`;
      this.accountService.getHeaders()
        .flatMap(headers => this.http.post(url, category, {headers: headers}))
        .subscribe(
          response => {
            if (response.ok) {
              observer.next(response.json());
              observer.complete();
            }
          },
          error => observer.error(new AppError(
            'auth/creation-failure',
            'Error appeared during account creation please try again later'))
        );
    });
  }

}
