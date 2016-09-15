import { Injectable } from '@angular/core';
import { AppConsts } from "../app.consts";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { AppError } from "../app-error";
import { UsernamePasswordCredentials } from "../username-password-credentials";

@Injectable()
export class TokenService {
  private accessToken: string;
  private refreshToken: string;
  private tokenType: string;
  private expirationTime: Date;
  private scope: string;
  private jti: string;

  private STORAGE_KEY = 'tokens';

  constructor(
    private APP_CONSTS: AppConsts,
    private http: Http
  ) {
    if (this.isTokensExistsInStorage()) {
      let tokens = this.getTokensFromStorage();
      this.populateFields(tokens);
    }
  }

  public saveTokens(tokenResponse: string): void {
    let tokesJson = JSON.parse(tokenResponse);
    let expiresInMilis = (tokesJson['expires_in'] as number) * 1000;
    tokesJson['expires_in'] = new Date(Date.now() + expiresInMilis).getTime();

    var tokensStr = JSON.stringify(tokesJson);
    localStorage.setItem(this.STORAGE_KEY, tokensStr);
    this.populateFields(tokensStr);
  }

  private populateFields(tokenResponse: string) {
    let tokenRespJson = JSON.parse(tokenResponse);

    this.accessToken = tokenRespJson['access_token'];
    this.refreshToken = tokenRespJson['refresh_token'];
    this.tokenType = tokenRespJson['token_type'];
    this.expirationTime = new Date(tokenRespJson['expires_in']);
    this.scope = tokenRespJson['scope'];
    this.jti = tokenRespJson['jti'];
  }

  public getAccessToken(credentials?: UsernamePasswordCredentials): Observable<string> {
    return new Observable<string>(
      observer => {
        let accessTokenError = new AppError(
          'token/authorization-server',
          'Can not obtain access token from authorization server'
        );

        if (!this.accessToken && !credentials) {
          observer.error(new AppError(
            'token/access_token-missing',
            'Access token is missing'
          ));
        } else if (!this.accessToken && credentials) {
          this.getTokens(credentials).subscribe(
            tokensResponse => {
              this.saveTokens(tokensResponse);

              observer.next(this.accessToken);
              observer.complete();
            },
            error => observer.error(accessTokenError)
          );
        } else if (this.isAccessTokenExpired()) {
          this.getTokensFromRefreshToken(this.getRefreshToken()).subscribe(
            tokensResponse => {
              this.saveTokens(tokensResponse);

              observer.next(this.accessToken);
              observer.complete();
            },
            error => observer.error(accessTokenError)
          )
        } else {
          observer.next(this.accessToken);
          observer.complete();
        }
      }
    );
  }

  private getRefreshToken(): string {
    return this.refreshToken;
  }

  public getTokenType(): string {
    if (!this.tokenType) {
      return null;
    }

    return this.tokenType;
  }

  private getExpirationTime(): Date {
    return this.expirationTime;
  }

  public isAccessTokenExpired(): boolean {
    let now = new Date();

    return !!(this.expirationTime
                && now.getTime() > this.expirationTime.getTime());
  }

  private getTokensFromStorage(): string {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  private isTokensExistsInStorage(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  private getTokens(credentials: UsernamePasswordCredentials): Observable<string> {
    return new Observable<string>(observer => {
      let grantType = `grant_type=password`;
      let clientId = 'client_id=user_cred';
      let scope = 'scope=read write';
      let username = `username=${credentials.username}`;
      let password = `password=${credentials.password}`;

      let body = encodeURI(`${grantType}&${clientId}&${scope}&${username}&${password}`);
      let url = this.APP_CONSTS.AUTH_ENDPOINT;

      this.http.post(url, body, {
        headers: this.getHeadersForTokenRequest()
      }).subscribe(
        response => {
          if (response.ok) {
            observer.next(response.text());
            observer.complete();
          }
        },
        error => observer.error(error)
      );
    });
  }

  private getTokensFromRefreshToken(refreshToken: string): Observable<string> {
    return new Observable<string>(observer => {
      let url = this.APP_CONSTS.AUTH_ENDPOINT;
      let grantType = 'grant_type=refresh_token';
      let refreshTokenParam = `refresh_token=${refreshToken}`;

      let body = `${grantType}&${refreshTokenParam}`;

      this.http.post(url, body, {headers: this.getHeadersForTokenRequest()}).subscribe(
        response => {
          if (response.ok) {
            observer.next(response.text());
            observer.complete();
          }
        },
        error => observer.error(error)
      )
    });
  }

  private getHeadersForTokenRequest(): Headers {
    let headers = new Headers();
    headers.append('Authorization', `Basic ${this.APP_CONSTS.CLIENT_AUTH_HASH}`);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return headers;
  }

  public deleteTokensFromStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);

    this.accessToken = null;
    this.refreshToken = null;
    this.tokenType = null;
    this.expirationTime = null;
    this.scope = null;
    this.jti = null;
  }
}
