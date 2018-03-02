import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Page} from '../shared/entity/page';
import {AccountDTO} from '../shared/dto/account-dto';
import {NotificationsService} from 'angular2-notifications';
import {CoinService} from '../shared/services/coin.service';
import {Pageable} from '../shared/entity/pageable';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  searchClass: string = 'fa-search';
  cancelClass: string = 'fa-close';
  searchChangeClass: string = this.searchClass;

  page: Page<AccountDTO>;
  pageable = new Pageable([]);
  pageForm: FormGroup;
  search: FormGroup;
  searchData: string = null;

  pageSize: number = 10;
  pageItems: number = 5;
  pageDirectionLinks: boolean = true;
  pageItemsSize: string = '';

  constructor(private coinService: CoinService,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.buildPageSizeForm();
    this.buildSearchForm();
    this.fetch(1, this.pageSize);
    this.search.get('value').valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(change => {
        if (change != '') {
          this.searchChangeClass = this.cancelClass;
          this.searchData = change;
          this.fetch(1, this.pageSize);
        } else {
          this.searchData = null;
          this.fetch(1, this.pageSize);
          this.searchChangeClass = this.searchClass;
        }
      });
  }

  private buildPageSizeForm(): void {
    this.pageForm = new FormGroup({
      pageSize: new FormControl('10')
    });
    if (window.innerWidth <= 800) {
      this.pageItems = 3;
      this.pageItemsSize = 'sm';
      this.pageDirectionLinks = true;
    }
    this.pageForm.get('pageSize').valueChanges.subscribe(change => {
      this.pageSize = change;
      this.fetch(1, this.pageSize);
    });
  }

  private buildSearchForm(): void {
    this.search = new FormGroup({
      value: new FormControl('')
    });
  }

  changePage(number: number): void {
    this.fetch(number, this.pageSize);
  }

  fetch(page: number, size: number): void {
    try {
      this.pageable.page = page - 1;
      this.pageable.size = size;
      if (this.searchData === null) {
        this.coinService.getAccounts(this.pageable).subscribe(response => {
          this.page = response;
        });
      } else {
        this.coinService.searchByAccounts(this.searchData, this.pageable).subscribe(response => {
          this.page = response;
        });
      }
    } catch (error) {
      this.notificationService.error('Error', 'Something went wrong, watch logs!');
    }
  }

  fetchByLastState(): void {
    try {
      if (this.searchData === null) {
        this.coinService.getAccounts(this.pageable).subscribe(response => {
          this.page = response;
        });
      } else {
        this.coinService.searchByAccounts(this.searchData, this.pageable).subscribe(response => {
          this.page = response;
        });
      }
    } catch (error) {
      this.notificationService.error('Error', 'Something went wrong, watch logs!');
    }
  }

  deactivate(ldapId: string) {
    try {
      this.coinService.deleteAccount(ldapId).subscribe(() => this.fetchByLastState());
    } catch (error) {
      this.notificationService.error('Error', 'Something went wrong, watch logs!');
    }
  }

}
