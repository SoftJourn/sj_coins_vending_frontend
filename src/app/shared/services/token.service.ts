import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AppError } from '../app-error';
import { AppProperties } from '../app.properties';
import { Role } from '../entity/role';
import { UsernamePasswordCredentials } from '../username-password-credentials';
import { MediaType } from '../media-type';
import { HttpHeadersConst } from '../http-headers';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

@Injectable()
export class TokenService {
  private accessToken: string;
  private refreshToken: string;
  private tokenType: string;
  private expirationTime: Date;
  private scope: string;
  private jti: string;
  private _authorities: Role[];

  private STORAGE_KEY = 'tokens';

  constructor(private http: HttpClient) {
    if (this.isTokensExistsInStorage()) {
      const tokens = this.getTokensFromStorage();
      this.populateFields(tokens);
    }
  }

  public saveTokens(tokenResponse: string): void {
    localStorage.setItem(this.STORAGE_KEY, tokenResponse);
    this.populateFields(tokenResponse);
  }

  private populateFields(tokenResponse: string) {
    const tokenRespJson = JSON.parse(tokenResponse);
    this.accessToken = tokenRespJson['access_token'];
    this.refreshToken = tokenRespJson['refresh_token'];
    this.tokenType = tokenRespJson['token_type'];
    this.expirationTime = TokenService.getExpirationTimeFromPayload(tokenRespJson['access_token']);
    this.scope = tokenRespJson['scope'];
    this.jti = tokenRespJson['jti'];
    this._authorities = JSON.parse(atob(this.accessToken.split('.', 2)[1])).authorities.map(a => new Role(a, false));
  }

  private static getExpirationTimeFromPayload(accessToken: string): Date {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));

    return new Date((payload['exp'] - 30) * 1000);
  }

  public getAccessToken(credentials?: UsernamePasswordCredentials): Observable<string> {

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

  public getTokenType(): string {
    if (!this.tokenType) {
      return null;
    }

    return this.tokenType;
  }

  public isAccessTokenExpired(): boolean {
    const now = new Date();

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
    const grantType = `grant_type=password`;
    const clientId = 'client_id=user_cred';
    const scope = 'scope=read write';
    const username = `username=${credentials.username}`;
    const password = `password=${credentials.password}`;

    const body = encodeURI(`${grantType}&${clientId}&${scope}&${username}&${password}`);
    const url = AppProperties.AUTH_ENDPOINT;

    const headers = TokenService.getHeadersForTokenRequest();

    return this.http.post<Object>(url, body, {headers: headers})
      .map((response) => JSON.stringify(response));
  }

  private getTokensFromRefreshToken(refreshToken: string): Observable<string> {
    const url = AppProperties.AUTH_ENDPOINT;
    const grantType = 'grant_type=refresh_token';
    const refreshTokenParam = `refresh_token=${refreshToken}`;

    const body = `${grantType}&${refreshTokenParam}`;

    return this.http.post<Object>(url, body, {headers: TokenService.getHeadersForTokenRequest()})
      .map(response => JSON.stringify(response));
  }

  private static getHeadersForTokenRequest(): HttpHeaders {
    return new HttpHeaders()
      .set(HttpHeadersConst.AUTHORIZATION, `Basic ${AppProperties.CLIENT_AUTH_HASH}`)
      .set(HttpHeadersConst.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED)  ;
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

  public getAuthHttpHeaders(): Observable<HttpHeaders> {
    return this.getAccessToken()
      .map(accessToken => {
        const token = this.getTokenType() +  ' ' + accessToken;
        return new HttpHeaders().set(HttpHeadersConst.AUTHORIZATION, token);
      });
  }

  public getAuthHeaders(): Observable<Headers> {
    return this.getAccessToken()
      .map(accessToken => {
        const token = this.getTokenType() +  ' ' + accessToken;
        const headers = new Headers();
        headers.append(HttpHeadersConst.AUTHORIZATION, token);
        return headers;
      });
  }


  public revokeRefreshToken(): Observable<{}> {
    if (!this.refreshToken) {
      return Observable.throw(new AppError(
        'token/refresh_token-missing',
        'Refresh token is missing'));
    }


    const url = `${AppProperties.AUTH_ENDPOINT}/revoke`;
    const body = `token_value=${this.refreshToken}`;

    return this.getAuthHttpHeaders().flatMap((headers: HttpHeaders) => {
      return this.http.post(url, body, {headers: headers.set(HttpHeadersConst.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED)});
    });
  }

  get authorities(): Role[] {
    return this._authorities;
  }

}
