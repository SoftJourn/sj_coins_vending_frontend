export class Condition {

  field: string;
  value: Object;
  comparison: string;

  constructor(field: string, value: Object, comparison: string) {
    this.field = field;
    this.value = value;
    this.comparison = comparison;
  }
}
