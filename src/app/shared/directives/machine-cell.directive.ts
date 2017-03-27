import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[machineCell]'
})
export class MachineCellDirective {
  @Input() cellId: string;

  constructor(private el: ElementRef) { }

  public getElement(): any {
    return this.el.nativeElement;
  }
}
