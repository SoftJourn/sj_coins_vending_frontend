import {
  Component,
  OnInit,
  Input
} from "@angular/core";
import {FormControl} from "@angular/forms";

@Component({
  selector: '[app-cascade-items]',
  templateUrl: 'cascade-items.component.html',
  styleUrls: ['cascade-items.component.scss']
})
export class CascadeItemsComponent implements OnInit {

  @Input("data")
  data: any;

  @Input("field")
  field: string;

  @Input("control")
  control: FormControl;

  constructor() {
  }

  ngOnInit() {
    if (!this.field) {
      this.field = "";
    }
  }

  getKeys(): string[] {
    return Object.keys(this.data);
  }

  hasSubsClass(obj: any): string {
    if (typeof obj === 'string') {
      return "";
    }
    return Object.keys(obj).length > 0 ? "dropdown-submenu" : "";
  }

  hasSubs(obj: any): boolean {
    if (typeof obj === 'string') {
      return false;
    }
    return Object.keys(obj).length > 0;
  }

  click(event: Event, data: string): void {
    if (typeof this.data[data] === 'string') {
      this.control.patchValue(this.field + data);
    }
    event.stopImmediatePropagation();
  }

}
