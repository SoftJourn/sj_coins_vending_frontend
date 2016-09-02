import { Component, OnInit } from "@angular/core";
import { AccountService, Account } from "../shared/";

@Component({
  selector: 'main-info',
  templateUrl: 'main-info.component.html',
  styleUrls: ['main-info.component.scss'],
})
export class MainInfoComponent implements OnInit {
  account: Account;

  constructor(
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.account = this.accountService.getAccount()
  }

}
