import { Injectable, Inject } from "@angular/core";
import {
  Account,
  AccountPhoto,
  AppError,
  EmailPasswordCredentials
} from "../";
import { Observable } from "rxjs/Rx";
import { Http, Headers } from "@angular/http";
import { TokenService } from "./token.service";
import { AppConsts } from "../app.consts";

@Injectable()
export class AccountService {
  private account: Account;
  private STORAGE_KEY = 'account';

  constructor(
    private APP_CONSTS: AppConsts,
    private tokenService: TokenService,
    private http: Http
  ) {}

  private createAccount(): Observable<Account> {
    return new Observable<Account>(observer => {
      let url = `${this.APP_CONSTS.API_ENDPOINT}/account/me`;

      this.getHeaders()
        .flatMap(headers => this.http.get(url, {headers: headers}))
        .subscribe(
          response => {
            if (response.ok) {
              let account = this.createAccountFromJson(response.json());
              observer.next(account);
              observer.complete();
            } else {
              observer.error(new AppError(
                'auth/creation-failure',
                'Error appeared during account creation please try again later'));
            }
          },
          error => observer.error(new AppError(
            'auth/creation-failure',
            'Error appeared during account creation please try again later'))
        );
    });
  }

  public login(credentials: EmailPasswordCredentials): Observable<void> {
    return new Observable<void>(observer => {
      if (this.verifyCredentials(credentials)) {
        let grantType = `grant_type=password`;
        let clientId = 'client_id=trustedClient';
        let scope = 'scope=read write trust';
        let username = `username=${credentials.email}`;
        let password = `password=${btoa(credentials.password)}`;

        let body = encodeURI(`${grantType}&${clientId}&${scope}&${username}&${password}`);
        let url = this.APP_CONSTS.AUTH_ENDPOINT;

        this.http.post(url, body, {
          headers: this.getHeadersForTokenRequest()
        }).subscribe(
          response => {
            if (response.ok) {
              this.tokenService.saveTokens(response.text());
              this.createAccount().subscribe(
                account => {
                  this.account = account;
                  observer.complete();
                },
                error => observer.error(error)
              )
            }
          }
        )
      } else {
        observer.error(new AppError(
          'auth/zendesk-account-not-found',
          'Wrong credentials or you do not have Zendesk account'
        ));
      }
    });
  }

  public logout(): void {
    this.deleteAccountFromLocalStorage();
    this.tokenService.deleteTokensFromStorage();
  }

  private verifyCredentials(credentials: EmailPasswordCredentials): boolean {
    let regExp = /^[\w!@#\$%\^&\*\(\)\-\\\.|\/\?><;':"+=~`{}\[\],]+$/i;

    return regExp.test(credentials.email) && regExp.test(credentials.password);
  }

  private createAccountFromJson(user: any): Account {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));

    return new Account(
      user.id,
      user.name,
      user.email,
      new AccountPhoto(
        user.photo.id,
        user.photo['content_url'],
        user.photo['file_name'],
        user.photo.width,
        user.photo.height
      )
    );
  }

  public getAccount(): Account {
    if (this.account) {
      return this.account
    } else {
      return JSON.parse(localStorage.getItem('account'));
    }
  }

  private getHeadersForTokenRequest(): Headers {
    let headers = new Headers();
    headers.append('Authorization', 'Basic dHJ1c3RlZENsaWVudDpjb25maWdzZWM=');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return headers;
  }

  private getHeaders(): Observable<Headers> {
    return new Observable<Headers>(observer => {
      if (!this.tokenService.getTokenType()) {
        observer.error(new AppError(
          'header/authorization',
          'Error appeared during creation of authorization headers'
        ))
      }

      this.tokenService.getAccessToken().subscribe(
        accessToken => {
          let headers = new Headers();

          let authValue = `${this.tokenService.getTokenType()} ${accessToken}`;
          headers.append('Authorization', authValue);

          observer.next(headers);
          observer.complete();
        },
        error => observer.error(error)
      );
    });
  }

  private deleteAccountFromLocalStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.account = null;
  }
}
