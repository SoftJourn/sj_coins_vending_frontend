import { Injectable } from '@angular/core';
import { Machine, Field, Row } from "../../machines/shared/machine";

@Injectable()
export class MachineService {
  private machines: Machine[];
  private machine: Machine;

  constructor() {
    this.machine = new Machine('123456', [
      new Row(1, [
        new Field('A0'),
        new Field('A1'),
        new Field('A2'),
        new Field('A3'),
        new Field('A4'),
        new Field('A5')
      ]),
      new Row(2, [
        new Field('B0'),
        new Field('B1'),
        new Field('B2'),
        new Field('B3'),
        new Field('B4'),
        new Field('B5')
      ]),
      new Row(3, [
        new Field('C0'),
        new Field('C1'),
        new Field('C2'),
        new Field('C3'),
        new Field('C4'),
        new Field('C5')
      ]),
      new Row(4, [
        new Field('D0'),
        new Field('D1'),
        new Field('D2'),
        new Field('D3'),
        new Field('D4'),
        new Field('D5')
      ]),
      new Row(5, [
        new Field('E0'),
        new Field('E1'),
        new Field('E2'),
        new Field('E3'),
        new Field('E4'),
        new Field('E5')
      ])
    ]);
  }

  getMachine(machineId: string): Machine {
    return this.machine;
  }
}
