import { Injectable } from "@angular/core";


@Injectable()
export class AppConsts {
  API_ENDPOINT = 'http://localhost:8080/api';
  AUTH_ENDPOINT = 'http://localhost:8080/oauth/token';
}
