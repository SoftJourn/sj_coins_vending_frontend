import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { TokenService } from "./token.service";
import { AppProperties } from "../app.properties";
import { AppError } from "../app-error";
import { Account } from "../entity/account";
import { UsernamePasswordCredentials } from "../username-password-credentials";
import { HttpService } from "./http.service";

@Injectable()
export class AccountService {
  private account: Account;
  private STORAGE_KEY = 'account';

  constructor(
    private tokenService: TokenService,
    private httpService: HttpService
  ) {}

  private createAccount(username: string): Observable<Account> {
    return new Observable<Account>(observer => {
      let accountCreationError = new AppError(
        'auth/creation-failure',
        'Error appeared during account creation please try again later');

      let url = `${AppProperties.USER_ENDPOINT}/${username}`;

      this.httpService.get(url).subscribe(
        response => {
          if (response.ok) {
            let account = this.createAccountFromJson(response.json());
            observer.next(account);
            observer.complete();
          } else {
            observer.error(accountCreationError);
          }
        },
        error => observer.error(accountCreationError)
      );
    });
  }

  public login(credentials: UsernamePasswordCredentials): Observable<void> {
    return new Observable<void>(observer => {
      let badCredError = new AppError(
        'auth/account-not-found',
        'Wrong credentials'
      );

      if (this.verifyCredentials(credentials)) {
        this.tokenService.getAccessToken(credentials).subscribe(
          accessToken => {
            this.createAccount(credentials.username).subscribe(
              account => {
                this.account = account;
                observer.complete();
              },
              error => observer.error(error)
            )
          },
          error => observer.error(badCredError)
        );
      } else {
        observer.error(badCredError);
      }
    });
  }

  public logout(): void {
    this.deleteAccountFromLocalStorage();
    this.tokenService.deleteTokensFromStorage();
  }

  private verifyCredentials(credentials: UsernamePasswordCredentials): boolean {
    let regExp = /^[\w!@#\$%\^&\*\(\)\-\\\.|\/\?><;':"+=~`{}\[\],]+$/i;

    return regExp.test(credentials.username) && regExp.test(credentials.password);
  }

  private createAccountFromJson(user: any): Account {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));

    return new Account(
      user.ldapName,
      user.fullName,
      user.email
    );
  }

  public getAccount(): Account {
    return JSON.parse(localStorage.getItem('account'));
  }

  private deleteAccountFromLocalStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.account = null;
  }
}
