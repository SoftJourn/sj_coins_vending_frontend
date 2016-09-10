import { Product } from "../../shared/product";

export class Machine {
  id: string;
  rows: Row[];

  constructor(id: string, rows: Row[]) {
    this.id = id;
    this.rows = rows;
  }
}

export class Row {
  id: number;
  fields: Field[];

  constructor(id: number, fields: Field[]) {
    this.id = id;
    this.fields = fields;
  }
}

export class Field {
  id: number;
  internalId: string;
  count = 0;
  product: Product;

  constructor(internalId: string) {
    this.internalId = internalId;
  }
}
