export class Transaction {

  id?: number;
  account?: string;
  destination?: string;
  amount?: number;
  comment?: string;
  created?: string;
  status?: string;
  error?: string;


  constructor(id: number, account: string, destination: string, amount: number, comment: string, created: string, status: string, error: string) {
    this.id = id;
    this.account = account;
    this.destination = destination;
    this.amount = amount;
    this.comment = comment;
    this.created = created;
    this.status = status;
    this.error = error;
  }

}
