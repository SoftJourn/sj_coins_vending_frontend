import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import {
  MediaType,
  HttpHeaders,
  UsernamePasswordCredentials } from "../";
import { AppError } from "../app-error";
import { AppProperties } from "../app.properties";

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
    private http: Http
  ) {
    if (this.isTokensExistsInStorage()) {
      let tokens = this.getTokensFromStorage();
      this.populateFields(tokens);
    }
  }

  public saveTokens(tokenResponse: string): void {
    localStorage.setItem(this.STORAGE_KEY, tokenResponse);
    this.populateFields(tokenResponse);
  }

  private populateFields(tokenResponse: string) {
    let tokenRespJson = JSON.parse(tokenResponse);

    this.accessToken = tokenRespJson['access_token'];
    this.refreshToken = tokenRespJson['refresh_token'];
    this.tokenType = tokenRespJson['token_type'];
    this.expirationTime = this.getExpirationTimeFromPayload(tokenRespJson['access_token']);
    this.scope = tokenRespJson['scope'];
    this.jti = tokenRespJson['jti'];
  }

  private getExpirationTimeFromPayload(accessToken: string): Date {
    var payload = JSON.parse(atob(accessToken.split('.')[1]));

    return new Date((payload['exp'] - 30) * 1000);
  }

  public getAccessToken(credentials?: UsernamePasswordCredentials): Observable<string> {
    let authServerError = new AppError(
      'auth/auth-server-error',
      'Can not obtain access token from authorization server'
    );

    if (!this.accessToken && !credentials) {
      return <Observable<string>>Observable.throw(new AppError(
        'token/access_token-missing',
        'Access token is missing'
      ));
    } else if (!this.accessToken && credentials) {
      return this.getTokens(credentials)
        .map(tokenResponse => {
          this.saveTokens(tokenResponse);

          return this.accessToken;
        });
    } else if (this.isAccessTokenExpired()) {
      return this.getTokensFromRefreshToken(this.refreshToken)
        .map(tokenResponse => {
          this.saveTokens(tokenResponse);

          return this.accessToken;
        });
    } else {
      return Observable.of(this.accessToken);
    }
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

    console.log(this.expirationTime);

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
    let grantType = `grant_type=password`;
    let clientId = 'client_id=user_cred';
    let scope = 'scope=read write';
    let username = `username=${credentials.username}`;
    let password = `password=${credentials.password}`;

    let body = encodeURI(`${grantType}&${clientId}&${scope}&${username}&${password}`);
    let url = AppProperties.AUTH_ENDPOINT;

    return this.http.post(url, body, {headers: this.getHeadersForTokenRequest()})
      .map(response => response.text());
  }

  private getTokensFromRefreshToken(refreshToken: string): Observable<string> {
    let url = AppProperties.AUTH_ENDPOINT;
    let grantType = 'grant_type=refresh_token';
    let refreshTokenParam = `refresh_token=${refreshToken}`;

    let body = `${grantType}&${refreshTokenParam}`;

    return this.http.post(url, body, {headers: this.getHeadersForTokenRequest()})
      .map(response => response.text());
  }

  private getHeadersForTokenRequest(): Headers {
    let headers = new Headers();
    headers.append(HttpHeaders.AUTHORIZATION, `Basic ${AppProperties.CLIENT_AUTH_HASH}`);
    headers.append(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED);

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

  public revokeRefreshToken(): Observable<{}> {
    let url = `${AppProperties.AUTH_ENDPOINT}/revoke`;
    let body = `token_value=${this.refreshToken}`;

    return this.http.post(url, body, {headers: this.getHeadersForTokenRequest()})
      .map(response => Observable.empty());
  }
}
