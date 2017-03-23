import {Condition} from "./condition";
import {Pageable} from "../shared/entity/pageable";
export class TransactionPageRequest {

  conditions: Condition[];
  pageable: Pageable;


  constructor(conditions: Condition[], pageable: Pageable) {
    this.conditions = conditions;
    this.pageable = pageable;
  }
}
