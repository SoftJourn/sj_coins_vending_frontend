import {Injectable} from "@angular/core";
import {CrudService} from "./crud.service";
import {HttpService} from "./http.service";
import {AppProperties} from "../app.properties";
import {Account} from "../entity/account";

@Injectable()
export class LdapUsersService extends CrudService<Account>{

  constructor(protected httpService: HttpService){
    super(httpService,Account.prototype);
  }

  protected getUrl(): string {
    return `${AppProperties.AUTH_API}/users`;
  }
}
