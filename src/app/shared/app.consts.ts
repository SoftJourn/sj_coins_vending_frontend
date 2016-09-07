import { Injectable } from "@angular/core";


@Injectable()
export class AppConsts {
  API_VENDING_ENDPOINT = 'https://localhost:8222/v1';
  AUTH_ENDPOINT = 'https://localhost:8111/oauth/token';
  USER_ENDPOINT = 'https://localhost:8111/api/v1/users';
  CLIENT_AUTH_HASH = 'dXNlcl9jcmVkOnN1cGVyc2VjcmV0';
}
