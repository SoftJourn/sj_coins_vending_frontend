import { Component, OnInit } from '@angular/core';
import { Machine } from "./shared/machine";
import { MachineService } from "../shared/services/machine.service";

@Component({
  selector: 'machines-list',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent implements OnInit {
  machines: Machine[];

  constructor(private machineService: MachineService) { }

  ngOnInit() {
    this.getMachines();
  }

  private getMachines(): void {
    this.machineService.findAll().subscribe(
      machines => this.machines = machines,
      error => {}
    )
  }

  onDelete(id: number) {
    this.machineService.delete(id)
      .subscribe(
        () => {},
        error => {},
        () => this.getMachines()
      );
  }
}
