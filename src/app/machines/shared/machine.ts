import { Product } from "../../shared/entity/product";

export class Machine {

  constructor(
    public id: number,
    public name: string,
    public url: any,
    public rows: Row[],
    public size: MachineSize
  ) {}
}

export class Row {

  constructor(
    public id: number,
    public rowId: string,
    public fields: Field[]
  ) {}
}

export class Field {

  constructor(
    public id: number,
    public internalId: string,
    public position: number,
    public count = 0,
    public product: Product
  ) {}
}

export class MachineSize {

  constructor(
    public rows: number,
    public columns: number
  ) {}
}
