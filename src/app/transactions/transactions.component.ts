import {
  Component,
  OnInit,
  HostListener
} from "@angular/core";
import {TransactionService} from "../shared/services/transaction.service";
import {TransactionPage} from "./transaction-page";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from "@angular/forms";
import {Condition} from "./condition";
import {Pageable} from "./pageable";
import {TransactionPageRequest} from "./transaction-page-request";
import {Sort} from "./sort";
import {Router} from "@angular/router";
import {NotificationsService} from "angular2-notifications";
import {ErrorDetail} from "../shared/entity/error-detail";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  data: Object;

  page: TransactionPage;
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
    this.fetch(1, this.pageSize);
    this.buildFilterForm();

    let distinctFields = new Set();
    this.data = {
      account: {
        ldapId: "text",
        amount: "number",
        erisAccount: {
          address: "text",
          pubKey: "text",
          type: "text"
        }
      },
      destination: {
        ldapId: "text",
        amount: "number",
        erisAccount: {
          address: "text",
          pubKey: "text",
          type: "text"
        }
      },
      erisTransactionId: "text",
      amount: "number",
      comment: "text",
      status: "text",
      error: "text",
      created: "date",
    };
    Object.keys(this.data).forEach(key => {
      if (key != "id" && key != "remain" && key != "erisTransactionId") {
        distinctFields.add(key);
      }
    });
    this.fields = Array.from(distinctFields);
    this.addFilter();
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
    this.filterForm.controls[this.filterForm.controls.length - 1].get('field').patchValue(this.fields[this.fields.length - 1]);
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
      this.sorts.push(new Sort("ASC", column));
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
          if (this.transactionService.getType(value["field"]) == "date") {
            conditions.push(new Condition(value["field"], new Date(value["value"]).toISOString(), value["comparison"]));
          } else if (this.transactionService.getType(value["field"]) == "number" && Array.isArray(value["field"])) {
            conditions.push(new Condition(value["field"], value["value"].map(item => {
              return parseInt(item)
            }), value["comparison"]));
          } else {
            conditions.push(new Condition(value["field"], value["value"], value["comparison"]));
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
        if (this.transactionService.getType(value["field"]) == "number" && value["comparison"] == "in") {
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
      this.transactionService.get(filter).subscribe((response: TransactionPage) => {
        this.page = response;
      }, (error: ErrorDetail) => {
        this.notificationService.error("Error", error.detail);
      });
    } catch (error) {
      this.notificationService.error("Error", error.message);
    }
  }

}
