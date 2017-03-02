import {
  Component,
  OnInit,
  Input
} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {TransactionService} from "../../shared/services/transaction.service";

@Component({
  selector: 'app-transaction-filter-item',
  templateUrl: 'transaction-filter-item.component.html',
  styleUrls: ['transaction-filter-item.component.scss']
})
export class TransactionFilterItemComponent implements OnInit {

  @Input('fields')
  fields: string;

  @Input('formGroup')
  filter: FormGroup;

  constructor(protected transactionService: TransactionService) {
  }

  ngOnInit() {
  }

  changeField(): void {
    this.filter.get("value").patchValue("");
    this.filter.get('comparison').patchValue("eq");
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
    this.filter.get("value").patchValue(Array.from(inputs));
  }

}
