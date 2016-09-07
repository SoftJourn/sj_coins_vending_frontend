import { AccountPhoto } from "./";

export class Account {

  constructor(
    public ldapName: string,
    public fullName: string,
    public email: string
  ) {}
}
