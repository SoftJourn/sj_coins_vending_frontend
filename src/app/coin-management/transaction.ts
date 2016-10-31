export class Transaction {
  constructor(
    public id: number,
    public account: string,
    public destination: string,
    public amount: number,
    public comment: string,
    public created: string,
    public status: string,
    public remain: number,
    public error: string
  ) {}
}
