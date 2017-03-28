import {
  Component,
  OnInit,
  Input
} from "@angular/core";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-dropdown-cascade',
  templateUrl: 'dropdown-cascade.component.html',
  styleUrls: ['dropdown-cascade.component.scss']
})
export class DropdownCascadeComponent implements OnInit {

  @Input("data")
  data: any;

  @Input("control")
  control: FormControl;

  expand = "";

  constructor() {
  }

  ngOnInit() {
    this.control
      .valueChanges
      .distinctUntilChanged()
      .subscribe(change => {
        this.expand = this.expand == "expand" ? "" : "expand";
      });
  }

  dropDownExpand(): void {
    this.expand = this.expand == "expand" ? "" : "expand";
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

}
