import {
  Component,
  OnInit,
  HostListener
} from "@angular/core";
import {TransactionService} from "../shared/services/transaction.service";
import {Page} from "../shared/entity/page";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from "@angular/forms";
import {Condition} from "./condition";
import {Pageable} from "../shared/entity/pageable";
import {TransactionPageRequest} from "./transaction-page-request";
import {Sort} from "../shared/entity/sort";
import {Router} from "@angular/router";
import {NotificationsService} from "angular2-notifications";
import {ErrorDetail} from "../shared/entity/error-detail";
import {Transaction} from "../shared/entity/transaction";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  private STORAGE_KEY: string = "transactions-state";

  data: Object;

  page: Page<Transaction>;
  pageForm: FormGroup;
  filterForm: FormArray;
  fields: string[];
  sorts: Sort[];

  hideFilter: boolean = true;

  pageSize: number = 10;
  pageItems: number = 5;
  pageDirectionLinks: boolean = true;
  pageItemsSize: string = '';

  constructor(private transactionService: TransactionService,
              private router: Router,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.buildPageSizeForm();
    this.buildFilterForm();
    this.transactionService.getFilterData().subscribe(response => {
      this.data = response;
      let distinctFields = new Set();
      Object.keys(this.data).forEach(key => {
        if (key != "id" && key != "remain" && key != "erisTransactionId" && key != "transactionStoring") {
          distinctFields.add(key);
        }
      });
      this.fields = Array.from(distinctFields);
      this.addFilter();

      let state: TransactionPageRequest = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
      if (state) {
        this.sorts = state.pageable.sort;
        this.fetchByState(state);
      } else {
        this.defaultSorting();
        this.fetch(1, this.pageSize);
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

  private buildFilterForm(): void {
    this.filterForm = new FormArray([]);
  }

  addFilter(): void {
    this.filterForm.push(new FormGroup({
      field: new FormControl('', Validators.required),
      value: new FormControl('', [Validators.required, Validators.nullValidator]),
      comparison: new FormControl('', Validators.required)
    }));
    this.filterForm.controls[this.filterForm.controls.length - 1].get('field').patchValue(this.fields[this.getIndexOfFirstSingle()]);
    this.filterForm.controls[this.filterForm.controls.length - 1].get('comparison').patchValue("eq");
  }


  onSubmit(): void {
    this.fetch(1, this.pageSize);
  }

  onCancel(): void {
    this.filterForm.controls = [];
    this.addFilter();
    this.fetch(1, this.pageSize);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth > 800) {
      this.pageItems = 5;
      this.pageItemsSize = '';
      this.pageDirectionLinks = true;
    }
  }

  showFilter(): void {
    this.hideFilter = !this.hideFilter;
  }

  openTransaction(id: number): void {
    this.router.navigate(['/main/transactions/' + id]);
  }

  changePage(number: number): void {
    this.fetch(number, this.pageSize);
  }

  setSortClass(column: string): string {
    if (!this.sorts) {
      this.sorts = new Array<Sort>();
    }
    let sort = this.sorts.filter(sort => sort.property == column);
    if (sort.length < 1) {
      return "fa fa-sort";
    } else if (sort[0].direction == "ASC") {
      return "fa fa-sort-asc";
    } else if (sort[0].direction == "DESC") {
      return "fa fa-sort-desc";
    }
  }

  setSorting(column: string): void {
    if (!this.sorts) {
      this.sorts = new Array<Sort>();
    }
    let sort = this.sorts.filter(sort => sort.property == column);
    if (sort.length < 1) {
      this.sorts.unshift(new Sort("ASC", column));
    } else if (sort[0].direction == "ASC") {
      sort[0].direction = "DESC";
    } else {
      this.sorts.splice(this.sorts.indexOf(sort[0], 0), 1);
    }
    this.fetch(1, this.pageSize);
  }

  toTransactionFilter(formArray: FormArray): TransactionPageRequest {
    let conditions = new Array<Condition>();
    if (formArray) {
      for (let value of formArray.value) {
        if (value["value"] != "") {
          if (this.transactionService.getType(this.data, value["field"]) == "date") {
            conditions.push(new Condition(value["field"], new Date(value["value"]).toISOString(), value["comparison"]));
          } else if (this.transactionService.getType(this.data, value["field"]) == "number" && Array.isArray(value["field"])) {
            conditions.push(new Condition(value["field"], value["value"].map(item => {
              return parseInt(item)
            }), value["comparison"]));
          } else if (this.transactionService.getType(this.data, value["field"]) == "bool") {
            conditions.push(new Condition(value["field"], value["value"] == "true", value["comparison"]));
          } else {
            if (value["value"] == "EMPTY") {
              conditions.push(new Condition(value["field"], null, value["comparison"]));
            } else {
              conditions.push(new Condition(value["field"], value["value"], value["comparison"]));
            }
          }
        }
      }
    }
    let pageable = new Pageable(this.sorts);
    return new TransactionPageRequest(conditions, pageable);
  }

  validateInclude(formArray: FormArray): void {
    if (formArray) {
      for (let value of formArray.value) {
        if (this.transactionService.getType(this.data, value["field"]) == "number" && value["comparison"] == "in") {
          for (let number of value["value"]) {
            if (isNaN(number)) {
              throw new Error("Field " + value["field"] + "does not belong to type number");
            }
          }
        }
      }
    }
  }

  fetch(page: number, size: number): void {
    let filter;
    try {
      this.validateInclude(this.filterForm);
      filter = this.toTransactionFilter(this.filterForm);
      filter.pageable.page = page - 1;
      filter.pageable.size = size;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filter));
      this.transactionService.get(filter).subscribe((response: Page<Transaction>) => {
        this.page = response;
      }, (error: ErrorDetail) => {
        this.notificationService.error("Error", error.detail);
      });
    } catch (error) {
      this.notificationService.error("Error", "Something went wrong, watch logs!");
    }
  }

  fetchByState(state: TransactionPageRequest): void {
    try {
      this.transactionService.get(state).subscribe((response: Page<Transaction>) => {
        this.page = response;
      }, (error: ErrorDetail) => {
        this.notificationService.error("Error", error.detail);
      });
    } catch (error) {
      this.notificationService.error("Error", "Something went wrong, watch logs!");
    }
  }

  private getIndexOfFirstSingle(): number {
    for (let i = 0; i < this.fields.length; i++) {
      if (!(this.data[this.fields[i]] instanceof Object)) {
        return i;
      }
    }
  }

  private defaultSorting(): void {
    for (let field of this.fields) {
      if (this.data[field] == "date") {
        this.sorts = new Array<Sort>();
        this.sorts.push(new Sort("DESC", field));
      }
    }
  }

}
