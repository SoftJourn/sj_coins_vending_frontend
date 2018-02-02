import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {TokenService} from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  tokenService: TokenService;

  constructor(private injector: Injector) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.tokenService) {
      this.tokenService = this.injector.get(TokenService);
    }

    if (request.method === 'OPTIONS' || /token/.test(request.url)) {
      return next.handle(request);
    }

    return this.tokenService.getAccessToken().flatMap((token) => {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(request);
    });
  }
}
