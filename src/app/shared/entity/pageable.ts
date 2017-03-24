import {Sort} from "./sort";
export class Pageable {

  page: number;
  size: number;
  sort: Sort[];


  constructor(sort: Sort[]) {
    this.sort = sort;
  }
}
