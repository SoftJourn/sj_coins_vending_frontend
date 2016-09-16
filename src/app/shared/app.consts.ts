import { Injectable } from "@angular/core";


@Injectable()
export class AppConsts {
  API_VENDING_ENDPOINT = 'https://vending.softjourn.if.ua/v1';
  AUTH_ENDPOINT = 'https://sjcoins.testing.softjourn.if.ua/auth/oauth/token';
  USER_ENDPOINT = 'https://sjcoins.testing.softjourn.if.ua/auth/api/v1/users';
  CLIENT_AUTH_HASH = 'dXNlcl9jcmVkOnN1cGVyc2VjcmV0';
}
