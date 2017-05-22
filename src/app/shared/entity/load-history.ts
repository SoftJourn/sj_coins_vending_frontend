export class LoadHistory {

  total: number;
  date: string;
  productName: string;
  productPrice: number;
  cell: string;
  count: number;

  constructor(total: number, date: string, productName: string, productPrice: number, cell: string, count: number) {
    this.total = total;
    this.date = date;
    this.productName = productName;
    this.productPrice = productPrice;
    this.cell = cell;
    this.count = count;
  }
}
