import {
  Component,
  OnInit
} from "@angular/core";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {TransactionService} from "../../shared/services/transaction.service";
import {FullTransaction} from "../../shared/entity/full-transaction";

@Component({
  selector: 'app-transaction',
  templateUrl: 'transaction.component.html',
  styleUrls: ['transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  private subscription: Subscription;

  transaction: FullTransaction;
  generalFields: Array<string>;
  blockFields: Array<string>;
  erisFields: Array<string>;
  callingFields: Array<string>;

  constructor(private route: ActivatedRoute,
              private transactionService: TransactionService) {
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.transactionService.getById(params['id']).subscribe(response => {
          this.transaction = response;
          this.generalFields = Object.keys(this.transaction).filter(key => {
            if (key != "transactionStoring" && key!= "id") {
              return key;
            }
          });
          if (this.transaction["transactionStoring"]) {
            this.blockFields = Object.keys(this.transaction.transactionStoring).filter(key => {
              if (key != "transaction" && key != "callingValue" && key!= "id")
                return key;
            });
            this.erisFields = Object.keys(this.transaction.transactionStoring.transaction).filter(key => {
              return key;
            });
            this.callingFields = Object.keys(this.transaction.transactionStoring.callingValue).filter(key => {
              return key;
            });
          }
        })
      });

  }

}
