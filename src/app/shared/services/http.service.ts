import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { HttpHeadersConst } from '../http-headers';

@Injectable()
export class HttpService {

  constructor(
    public http: Http,
    private tokenService: TokenService
  ) { }

  get(url: string): Observable<Response> {
    return this.tokenService.getAuthHeaders()
      .flatMap(
        headers => this.http.get(url, {headers: headers})
      );
  }

  post(url: string, body: any, contentType?: string): Observable<Response> {
    return this.tokenService.getAuthHeaders()
      .flatMap((headers: Headers) => {
        if (contentType == null) {
          return this.http.post(url, body, {headers: headers});
        } else {
          headers.append(HttpHeadersConst.CONTENT_TYPE, contentType);

          return this.http.post(url, body, {headers: headers});
        }
      });
  }

  put(url: string, body: any, contentType: string): Observable<Response> {
    return this.tokenService.getAuthHeaders()
      .flatMap((headers: Headers) => {
        headers.append(HttpHeadersConst.CONTENT_TYPE, contentType);

        return this.http.put(url, body, {headers: headers});
      });
  }

  delete(url: string): Observable<Response> {
    return this.tokenService.getAuthHeaders()
      .flatMap((headers: Headers) => this.http.delete(url, {headers: headers}));
  }

}
