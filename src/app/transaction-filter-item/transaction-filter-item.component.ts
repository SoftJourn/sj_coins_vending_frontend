import {
  Component,
  OnInit,
  Input
} from "@angular/core";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-transaction-filter-item',
  templateUrl: './transaction-filter-item.component.html',
  styleUrls: ['./transaction-filter-item.component.scss']
})
export class TransactionFilterItemComponent implements OnInit {

  @Input('fields')
  fields: string;

  @Input('formGroup')
  filter: FormGroup;

  constructor() {
  }

  ngOnInit() {
  }

  getType(field: string): string {
    let type;
    switch (field) {
      case 'account':
      case 'destination':
      case 'comment':
      case 'status':
      case 'error':
        type = "text";
        break;
      case 'amount':
        type = "number";
        break;
      case 'created':
        type = "date";
        break;
    }
    return type;
  }

}
