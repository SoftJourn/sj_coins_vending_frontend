import {Transaction} from "./transaction";
import {TransactionStoring} from "./transaction-storing";

export class FullTransaction extends Transaction {

  remain: number;
  transactionStoring: TransactionStoring;

}
