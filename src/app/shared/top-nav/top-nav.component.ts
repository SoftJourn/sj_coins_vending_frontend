import { Component, OnInit } from '@angular/core';
import { AccountService, Account } from "../";

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  account: Account;

  constructor(
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.account = this.accountService.getAccount()
  }

}
