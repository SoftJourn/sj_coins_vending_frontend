import {Pageable} from "../entity/pageable";
export class LoadHistoryRequest {
   machineId: number;
   start: string;
   due: string;
   pageable: Pageable;

  constructor(machineId: number,
              start: string,
              due: string,
              pageable: Pageable) {
    this.machineId = machineId;
    this.start = start;
    this.due = due;
    this.pageable = pageable;
  }
}
