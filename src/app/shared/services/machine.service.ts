import { Injectable } from "@angular/core";
import { Machine, Field } from "../../machines/shared/machine";
import { HttpService } from "./http.service";
import { AppProperties } from "../app.properties";
import { CrudService } from "./crud.service";
import { Observable } from "rxjs";
import { MediaType } from "../media-type";
import { UpdateFieldDTO } from "../../machines/fill-machine/update-field-dto";

@Injectable()
export class MachineService extends CrudService<Machine> {

  constructor(protected httpService: HttpService) {
    super(httpService);
  }

  protected getUrl(): string {
    return `${AppProperties.API_VENDING_ENDPOINT}/vending`;
  }

  public fillMachine(machine: Machine): Observable<Machine> {
    return this.httpService.put(this.getUrl(), machine, MediaType.APPLICATION_JSON)
      .map(response => response.json());
  }
  public updateMachine(machine: Machine): Observable<Machine> {
    let url = `${this.getUrl()}/update`;
    return this.httpService.put(url, machine, MediaType.APPLICATION_JSON)
        .map(response => response.json());
  }

  public resetMotorState(machine: Machine) {
    let url = `${this.getUrl()}/${machine.id}/reset`;
    return this.httpService.post(url, null, MediaType.APPLICATION_JSON);
  }
}
