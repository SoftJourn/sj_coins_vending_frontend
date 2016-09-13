export class AddMachineDTO {

  constructor(
    public name = '',
    public erisAccount = '',
    public rowsCount = 0,
    public rowsNumbering = '',
    public columnsCount = 0,
    public columnsNumbering = ''
  ) {}
}
