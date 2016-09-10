import {
  Component,
  OnInit,
  style,
  state,
  animate,
  transition,
  trigger } from "@angular/core";
import { MachineService } from "../../shared/services/machine.service";
import { Machine } from "../shared/machine";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'fill-machine',
  templateUrl: './fill-machine.component.html',
  styleUrls: ['./fill-machine.component.scss'],
  animations: [
    trigger('showHideForm', [
      state('inactive', style({display: 'none', opacity: 0})),
      state('active',   style({display: 'block', opacity: 1})),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => inactive', animate('300ms ease-out')),
    ]),
    trigger('selectDeselectCard', [
      state('inactive', style({'background-color': 'white'})),
      state('active',   style({'background-color': 'grey'})),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out')),
    ])
  ]
})
export class FillMachineComponent implements OnInit {
  private cellFormState = 'inactive';
  private selectedCardId = '';
  private selectedRowId = -1;
  machine: Machine;
  form: FormGroup;

  constructor(private machineService: MachineService) { }

  ngOnInit() {
    this.machine = this.machineService.getMachine('123456');

    this.form = new FormGroup({
      cellId: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required),
      count: new FormControl('', [
        Validators.required,
        Validators.pattern('[1-9][0-9]*')
      ])
    });
  }

  toggleState(cardId: string, rowId: number): void {
    this.selectedCardId = cardId;
    this.selectedRowId = rowId;
    this.cellFormState = 'active';
    this.form.controls['cellId'].patchValue(cardId, {onlySelf: true})
  }

  applyCellFormState(rowId: number): string {
    if (this.selectedRowId == rowId) {
      return 'active';
    } else {
      return 'inactive';
    }
  }

  applyCardState(cardId: string): string {
    if (cardId === this.selectedCardId && this.cellFormState === 'active') {
      return 'active';
    } else {
      return 'inactive';
    }
  }

  submit(): void {
    this.cancel();
  }

  cancel(): void {
    this.selectedRowId = -1;
    this.selectedCardId = '';
    this.cellFormState = 'inactive';
    this.form.reset();
  }
}
