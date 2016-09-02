import { AccountPhoto } from "./";

export class Account {

  constructor(
    public id: number,
    public name: string,
    public email: string,
    public photo: AccountPhoto
  ) {}
}
