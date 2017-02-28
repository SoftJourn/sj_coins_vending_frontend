export class Sort {

  direction: string;
  property: string;
  ignoreCase: boolean;
  nullHandling: string;
  ascending: string;


  constructor(direction: string, property: string, ignoreCase: boolean, nullHandling: string, ascending: string) {
    this.direction = direction;
    this.property = property;
    this.ignoreCase = ignoreCase;
    this.nullHandling = nullHandling;
    this.ascending = ascending;
  }

}
