import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { AccountService } from "./shared/";

@Injectable()
export class AuthGuard implements CanActivate {
  private auth: any;

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean>|boolean {
    if (this.accountService.getAccount()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
