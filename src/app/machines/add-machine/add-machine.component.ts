import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MachineService } from "../../shared/services/machine.service";

@Component({
  selector: 'add-machine',
  templateUrl: './add-machine.component.html',
  styleUrls: ['./add-machine.component.scss']
})
export class AddMachineComponent implements OnInit {
  form: FormGroup;

  constructor(private machineService: MachineService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      erisAccount: new FormControl('', Validators.required),
      rowsCount: new FormControl('', [
        Validators.required,
        Validators.pattern('\\d+')
      ]),
      rowsNumbering: new FormControl('ALPHABETICAL', Validators.required),
      columnsCount: new FormControl('', [
        Validators.required,
        Validators.pattern('\\d+')
      ]),
      columnsNumbering: new FormControl('NUMERICAL', Validators.required)
    });
  }

  submit() {
    this.machineService.createMachine(this.form.value)
  }
}
