import { Injectable } from "@angular/core";


@Injectable()
export class AppConsts {
  API_VENDING_ENDPOINT = 'http://sjcoins.testing.softjourn.if.ua/vending/v1';
  AUTH_ENDPOINT = 'http://sjcoins.testing.softjourn.if.ua/auth/oauth/token';
  USER_ENDPOINT = 'http://sjcoins.testing.softjourn.if.ua/auth/api/v1/users';
  CLIENT_AUTH_HASH = 'dXNlcl9jcmVkOnN1cGVyc2VjcmV0';
}
