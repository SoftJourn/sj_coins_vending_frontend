import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs";
import { AppError } from "../app-error";
import { TokenService } from "./token.service";

@Injectable()
export class HttpService {

  constructor(
    private http: Http,
    private tokenService: TokenService
  ) { }

  get(url: string): Observable<Response> {
    return new Observable<Response>(observer => {
      let options = new RequestOptions();

      this.getAuthHeaders()
        .flatMap(headers => {
          options.headers = headers;

          return this.http.get(url, options)
        })
        .subscribe(
          response => {
            observer.next(response);
            observer.complete();
          },
          error => observer.error(error)
        )
    });
  }

  post(url: string, body: any, contentType: string): Observable<Response> {
    return new Observable<Response>(observer => {
      let options = new RequestOptions();

      this.getAuthHeaders()
        .flatMap((headers: Headers) => {
          headers.append('Content-Type', contentType);
          options.headers = headers;

          return this.http.post(url, body, options);
        })
        .subscribe(
          response => {
            observer.next(response);
            observer.complete();
          },
          error => observer.error()
        );
    })
  }

  put(url: string, body: any, contentType: string): Observable<Response> {
    return new Observable<Response>(observer => {
      var options = new RequestOptions();

      this.getAuthHeaders()
        .flatMap(headers => {
          headers.append('Content-Type', contentType);
          options.headers = headers;

          return this.http.put(url, body, options)
        })
        .subscribe(
          response => {
            observer.next(response);
            observer.complete();
          },
          error => observer.error(error)
        );
    });
  }

  delete(url: string): Observable<Response> {
    return new Observable<Response>(observer => {
      let options = new RequestOptions();

      this.getAuthHeaders()
        .flatMap(headers => {
          options.headers = headers;

          return this.http.delete(url, options);
        })
        .subscribe(
          response => {
            observer.next(response);
            observer.complete();
          },
          error => observer.error(error)
        );
    });
  }

  private getAuthHeaders(): Observable<Headers> {
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
}
