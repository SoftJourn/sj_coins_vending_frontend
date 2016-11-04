import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { AccountService } from "./shared/";

export const routingGuardMap: { [key: string]: RegExp; } = {
  "ROLE_SUPER_USER":new RegExp(".*"),
  "ROLE_INVENTORY":new RegExp("^/main$|/main/coins"),
  "ROLE_BILLING":new RegExp("^/main$|/main/products|/main/machines|/main/categories"),
  "ROLE_USER_MANAGER":new RegExp("^/main$|/main/users")
};
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private accountService: AccountService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    let account = this.accountService.getAccount();
    if (account&&account.authorities) {
      if(account.authorities.some(a=>routingGuardMap[a.authority].test(state.url)))
        return true;
      return false;

    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
