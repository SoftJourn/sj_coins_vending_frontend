import { Component, OnInit } from '@angular/core';
import { AccountService } from "../services/account.service";
import { Router } from "@angular/router";

export const routes : { [key: string]: string[] } = {
  "ROLE_INVENTORY":["/main/coins"],
  "ROLE_BILLING":["/main/products","/main/machines","/main/categories"],
  "ROLE_USER_MANAGER":["/main/users"],
  "ROLE_SUPER_USER":["/main/coins"]
    .concat(["/main/products","/main/machines","/main/categories"])
    .concat(["/main/products","/main/machines","/main/categories"])
    .concat(["/main/users"])
};
@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  isActive = false;
  showMenu: string = '0';
  allowedRoutes;

  constructor(private accountService: AccountService,
              private router: Router) {
    // accountService.getAccount().authorities.map(a=>routes[a.authority]).;
    let route=[];
    accountService.getAccount().authorities.forEach(a=>route.push(routes[a.authority]));
    //noinspection TypeScriptUnresolvedFunction
    this.allowedRoutes=Array.from(new Set(route));

  }

  ngOnInit() {

  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  setSubmenuClass(element: string) {
    if (element === this.showMenu) {
      return 'expand';
    } else {
      return 'hide';
    }
  }

  hide() {
    this.isActive = !this.isActive;
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['/login']);
  }
}
