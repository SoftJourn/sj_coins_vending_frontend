import {
  Component,
  OnInit,
  HostListener
} from "@angular/core";
import {TransactionService} from "../shared/services/transaction.service";
import {Transaction} from "../shared/entity/transaction";
import {TransactionPage} from "./transaction-page";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from "@angular/forms";
import {Condition} from "./condition";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {Pageable} from "./pageable";
import {TransactionPageRequest} from "./transaction-page-request";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  page: TransactionPage;
  pageForm: FormGroup;
  filterForm: FormArray;
  transactions: Transaction[];
  fields: string[];

  hideFilter: boolean = true;

  pageSize: number = 10;
  pageItems: number = 5;
  pageDirectionLinks: boolean = true;
  pageItemsSize: string = '';

  constructor(private transactionService: TransactionService,
              private parser: NgbDateParserFormatter) {
  }

  ngOnInit() {
    this.buildPageSizeForm();
    this.transactions = [new Transaction(1, "vkraietskyi", "vdanyliuk", 100, "filling coins", Date.now(), "SUCCESS", 0, ""),
      new Transaction(2, "vdanyliuk", "vkraietskyi", 100, "give it back", Date.now(), "SUCCESS", 100, ""),
      new Transaction(675, "omartynets", null, 0, null, Date.now(), "FAILED", null, "Account Machine 3 not found."),
      new Transaction(1, "vkraietskyi", "vdanyliuk", 100, "filling coins", Date.now(), "SUCCESS", 0, ""),
      new Transaction(2, "vdanyliuk", "vkraietskyi", 100, "give it back", Date.now(), "SUCCESS", 100, ""),
      new Transaction(675, "omartynets", null, 0, null, Date.now(), "FAILED", null, "Account Machine 3 not found.")];
    this.page = new TransactionPage(this.transactions, true, 10, 30, null, true, 0, 3, 0);
    this.fields = [];
    for (let field in this.transactions[0]) {
      if (field != "id" && field != "remain") {
        this.fields.push(field);
      }
    }
    this.buildFilterForm();
  }

  private buildPageSizeForm(): void {
    this.pageForm = new FormGroup({
      pageSize: new FormControl('10')
    });
    if (window.innerWidth < 767) {
      this.pageItems = 3;
      this.pageItemsSize = 'sm';
      this.pageDirectionLinks = false;
    }
    this.pageForm.get('pageSize').valueChanges.subscribe(change => {
      this.pageSize = change;
    });
  }

  private buildFilterForm(): void {
    this.filterForm = new FormArray([]);
    this.addFilter();
  }

  addFilter(): void {
    this.filterForm.push(new FormGroup({
      field: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      comparison: new FormControl('', Validators.required)
    }));
    this.filterForm.controls[this.filterForm.controls.length - 1].get('field').patchValue(this.fields[0]);
    this.filterForm.controls[this.filterForm.controls.length - 1].get('comparison').patchValue("eq");
  }


  onSubmit(): void {
    this.fetch(1, 10);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth > 767) {
      this.pageItems = 5;
      this.pageItemsSize = '';
      this.pageDirectionLinks = true;
    }
  }

  showFilter(): void {
    this.hideFilter = !this.hideFilter;
  }

  toTransactionFilter(formArray: FormArray): TransactionPageRequest {
    let conditions = new Array<Condition>();
    let values = formArray.value;
    for (let value of values) {
      if (this.transactionService.getType(value["field"]) == "date") {
        conditions.push(new Condition(value["field"], new Date(this.parser.format(value["value"])).toISOString(), value["comparison"]));
      } else {
        conditions.push(new Condition(value["field"], value["value"], value["comparison"]));
      }
    }
    let pageable = new Pageable(0, 10, []);
    return new TransactionPageRequest(conditions, pageable);
  }

  fetch(page: number, size: number): void {
    let filter = this.toTransactionFilter(this.filterForm);
    console.log(filter);
  }

}
