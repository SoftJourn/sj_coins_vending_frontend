import { Pipe, PipeTransform } from "@angular/core";
import { MachineSize } from "../shared/machine";

@Pipe({
  name: 'machineSize'
})
export class MachineSizePipe implements PipeTransform {

  transform(size: MachineSize, args?: any): string {
    return `${size.rows}x${size.columns}x${size.cellLimit}`;
  }

}
