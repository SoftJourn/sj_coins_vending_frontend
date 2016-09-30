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

  public updateField(machineId: number, dto: UpdateFieldDTO): Observable<Field> {
    let url = `${this.getUrl()}/${machineId}/fields/${dto.field.id}`;

    let field = new Field(
      dto.field.id,
      dto.field.internalId,
      dto.count, dto.product
    );

    return this.httpService.post(url, field, MediaType.APPLICATION_JSON)
      .map(response => response.json());
  }
}
