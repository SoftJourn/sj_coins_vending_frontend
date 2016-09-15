import { Injectable } from "@angular/core";
import { AppConsts } from "../app.consts";
import { Observable } from "rxjs/Rx";
import { AppError } from "../app-error";
import { Dashboard } from "../entity/dashboard";
import { HttpService } from "./http.service";

@Injectable()
export class DashboardService {

  constructor(private APP_CONSTS: AppConsts,
              private httpService: HttpService) {
  }

  public getDashboard(): Observable<Dashboard> {
    return new Observable<Dashboard>(observer => {
      let url = `${this.APP_CONSTS.API_VENDING_ENDPOINT}/dashboard`;

      this.httpService.get(url).subscribe(
        response => {
          if (response.ok) {
            observer.next(response.json());
            observer.complete();
          }
        },
        error => observer.error(new AppError(
          'api/get-dashboard',
          'Error appeared during accessing dashboard data.'))
      );
    });
  }

}
