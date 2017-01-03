import {Transaction} from "./transaction";
export class CheckDTO {
  constructor(
    public total: number,
    public isDone: number,
    public transactions: Transaction[]
  ) {}
}
