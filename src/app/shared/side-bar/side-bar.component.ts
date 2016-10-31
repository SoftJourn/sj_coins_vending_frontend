import { Component, OnInit } from '@angular/core';
import { AccountService } from "../services/account.service";
import { Router } from "@angular/router";

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  isActive = false;
  showMenu: string = '0';

  constructor(private accountService: AccountService,
              private router: Router) {
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
