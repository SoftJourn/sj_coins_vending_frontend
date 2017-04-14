import {
  Component,
  OnInit,
  Input
} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {TransactionService} from "../../shared/services/transaction.service";
import {filter} from "rxjs/operator/filter";

@Component({
  selector: 'app-transaction-filter-item',
  templateUrl: 'transaction-filter-item.component.html',
  styleUrls: ['transaction-filter-item.component.scss']
})
export class TransactionFilterItemComponent implements OnInit {

  @Input('data')
  data: Object;

  @Input('formGroup')
  filter: FormGroup;

  isOpen: boolean;
  datetimeValue: string;

  autocomplete: string[];

  constructor(protected transactionService: TransactionService) {
  }

  ngOnInit() {
    this.filter.get('field')
      .valueChanges
      .distinctUntilChanged()
      .subscribe(change => {
        this.filter.get("value").patchValue("");
        this.filter.get('comparison').patchValue("eq");
        if (this.transactionService.getType(this.data, change) == "text") {
          this.transactionService.filterAutocompleteData(change).subscribe((response: string[]) => {
            for (let i = 0; i < response.length; i++) {
              if (response[i] == null) {
                response[i] = "EMPTY";
              }
            }
            this.autocomplete = response;
          });
        }
        if (this.transactionService.getType(this.data, change) == "bool") {
          this.filter.get("value").patchValue(true);
        }
      });
    this.filter.get('value').valueChanges
      .distinctUntilChanged()
      .subscribe(change => {
        if (change != "" && this.transactionService.getType(this.data, this.filter.get('field').value) == "text") {
          let result = this.autocomplete.filter(value => {
            if (value.includes("\n")) {
              let replace = value.replace(/(?:\n)/g, "");
              return replace.includes(change);
            }
          });
          if (result.length == 1) {
            this.filter.get('value').patchValue(result[0]);
          }
        }
      });
  }

  addWhileInclude(e): void {
    let inputs;
    if (this.filter.get("value").value == "") {
      inputs = new Set();
    } else {
      inputs = new Set(this.filter.get("value").value);
    }
    inputs.add(e);
    this.filter.get("value").patchValue(Array.from(inputs));
  }

  removeWhileInclude(e): void {
    let inputs = new Set(this.filter.get("value").value);
    inputs.delete(e);
    if (inputs.size == 0) {
      this.filter.get("value").patchValue(null);
    } else {
      this.filter.get("value").patchValue(Array.from(inputs));
    }
  }

  openDatepicker() {
    this.isOpen = true;
    setTimeout(() => {
      this.isOpen = false;
    }, 1000);
  }

  dateTimeSelected(result): void {
    this.datetimeValue = result["value"];
    this.filter.get("value").patchValue(result["value"]);
  }

}
