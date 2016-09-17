import { Injectable } from "@angular/core";
import { AppProperties } from "../app.properties";
import { Observable } from "rxjs/Rx";
import { AppError } from "../app-error";
import { Dashboard } from "../entity/dashboard";
import { HttpService } from "./http.service";

@Injectable()
export class DashboardService {

  constructor(private httpService: HttpService) {
  }

  public getDashboard(): Observable<Dashboard> {
    let url = `${AppProperties.API_VENDING_ENDPOINT}/dashboard`;

    return this.httpService.get(url)
      .map(response => response.json());
  }

}
