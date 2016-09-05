import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  isActive = false;
  showMenu: string = '0';

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  setSubmenuClass() {
    if (this.showMenu == '0') {
      return 'hide';
    } else {
      return 'expand';
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
