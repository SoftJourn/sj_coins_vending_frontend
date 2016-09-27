import { Injectable } from "@angular/core";
import { Machine } from "../../machines/shared/machine";
import { HttpService } from "./http.service";
import { AppProperties } from "../app.properties";
import { CrudService } from "./crud.service";

@Injectable()
export class MachineService extends CrudService<Machine> {

  constructor(protected httpService: HttpService) {
    super(httpService);
  }

  protected getUrl(): string {
    return `${AppProperties.API_VENDING_ENDPOINT}/vending`;
  }

  public updateField() {

  }
}
