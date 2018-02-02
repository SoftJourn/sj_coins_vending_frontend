import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {AccountService} from '../services/account.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {

  constructor(private injector: Injector,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .catch(response => {
        if (response instanceof HttpErrorResponse) {
          console.log('Processing http error', response);
          if (/token/.test(response.url)) {
            if (response.status === 401 || response.status === 400) {
              const accountService: AccountService = this.injector.get(AccountService);
              accountService.logout();
              this.router.navigate(['/login']);
              return Observable.empty();
            }
          }
        }
        return Observable.throw(response);
      });
  }


}
