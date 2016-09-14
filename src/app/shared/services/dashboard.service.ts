import {Injectable, Inject} from '@angular/core';
import {AppConsts} from "../app.consts";
import { Http, Headers, Response } from "@angular/http";
import {Observable} from "rxjs/Rx";
import {AppError} from "../app-error";
import {Dashboard} from "../entity/dashboard";
import {AccountService} from "./account.service";

@Injectable()
export class DashboardService {

  constructor(private APP_CONSTS:AppConsts,
              private accountService:AccountService,
              private http:Http) {
  }

  public getDashboard():Observable<Dashboard> {
    return new Observable<Dashboard>(observer => {
      let url = `${this.APP_CONSTS.API_VENDING_ENDPOINT}/dashboard`;
      this.accountService.getHeaders()
        .flatMap(headers => this.http.get(url, {headers: headers}))
        .subscribe(
          response => {
            if (response.ok) {
              let dashboard = this.jsonToDashboard(response.json());

              observer.next(dashboard);
              observer.complete();
            }
          },
          error => observer.error(new AppError(
            'auth/creation-failure',
            'Error appeared during account creation please try again later'))
        );
    });
  }

  private jsonToDashboard(json:any):Dashboard {
    return new Dashboard(
      json.products,
      json.machines,
      json.categories,
      json.purchases
    );
  }

}
