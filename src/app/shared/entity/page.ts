export class Page<T> {

  constructor(public content?: T[],
              public last?: boolean,
              public totalPages?: number,
              public totalElements?: number,
              public sort?: any,
              public first?: boolean,
              public numberOfElements?: number,
              public size?: number,
              public number?: number) {
  }

}
