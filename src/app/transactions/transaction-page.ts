import {Transaction} from "../shared/entity/transaction";
export class TransactionPage {

  constructor(public content?: Transaction[],
              public last?: boolean,
              public totalPages?: number,
              public totalElements?: number,
              public sort?: any,
              public first?: boolean,
              public numberOfElements?: number,
              public size?: number,
              public number?: number) {
  }

}
