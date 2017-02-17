export class Transaction {

  id?: number;
  account?: string;
  destination?: string;
  amount?: number;
  comment?: string;
  created?: number;
  status?: string;
  remain?: number;
  error?: string;


  constructor(id: number, account: string, destination: string, amount: number, comment: string, created: number, status: string, remain: number, error: string) {
    this.id = id;
    this.account = account;
    this.destination = destination;
    this.amount = amount;
    this.comment = comment;
    this.created = created;
    this.status = status;
    this.remain = remain;
    this.error = error;
  }

}
