import {Purchase} from "../../shared/entity/purchase";
export class PurchasePage {

  constructor(public content?: Purchase[],
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
