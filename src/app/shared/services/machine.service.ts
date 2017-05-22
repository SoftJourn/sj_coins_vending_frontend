import {Injectable} from "@angular/core";
import {Machine} from "../../machines/shared/machine";
import {HttpService} from "./http.service";
import {AppProperties} from "../app.properties";
import {CrudService} from "./crud.service";
import {Observable} from "rxjs";
import {MediaType} from "../media-type";
import {LoadHistoryRequest} from "../dto/load-history-request";
import {LoadHistory} from "../entity/load-history";

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

  public getLoads(loadHistory: LoadHistoryRequest): Observable<LoadHistory> {
    let url = `${this.getUrl()}/loads`;
    return this.httpService.post(url, loadHistory, MediaType.APPLICATION_JSON)
      .map(response => response.json());
  }

  public getLoadsReport(loadHistory: LoadHistoryRequest): Observable<Blob> {
    let url = `${this.getUrl()}/loads/export`;
    return this.httpService.post(url, loadHistory, MediaType.APPLICATION_JSON)
      .map(response => {
        let byteCharacters = atob(response.text());
        let byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], {type: 'application/vnd.ms-excel'});
      });
  }
}
