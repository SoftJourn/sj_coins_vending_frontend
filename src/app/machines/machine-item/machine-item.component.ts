import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Machine } from "../shared/machine";
import { MachineService } from "../../shared/services/machine.service";

@Component({
  selector: 'machine-item',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.scss']
})
export class MachineItemComponent implements OnInit {
  @Input() machine: Machine;
  @Output() onDelete = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {
  }

  deleteMachine(): void {
    this.onDelete.emit(this.machine.id);
  }
}
