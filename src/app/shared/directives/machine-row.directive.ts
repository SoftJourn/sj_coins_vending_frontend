import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[machineRow]'
})
export class MachineRowDirective {
  @Input() rowId: number;

  constructor(private el: ElementRef) { }

  public getElement(): any {
    return this.el.nativeElement;
  }
}
