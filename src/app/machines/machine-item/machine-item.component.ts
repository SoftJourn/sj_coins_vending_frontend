import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from "@angular/core";
import { Machine } from "../shared/machine";
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Overlay } from "angular2-modal";

@Component({
  selector: 'machine-item',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.scss']
})
export class MachineItemComponent implements OnInit {
  @Input() machine: Machine;
  @Output() onDelete = new EventEmitter<number>();

  constructor(overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
  }

  deleteMachine(): void {
    this.modal.confirm()
      .size('sm')
      .isBlocking(true)
      .showClose(true)
      .keyboard(27)
      .title('Delete machine')
      .body('Are you really want to delete this vending machine?')
      .okBtn('Yes')
      .okBtnClass('btn btn-success modal-footer-confirm-btn')
      .cancelBtn('Cancel')
      .cancelBtnClass('btn btn-secondary modal-footer-confirm-btn')
      .open().then((response)=> {
      response.result.then(() => {
        this.onDelete.emit(this.machine.id);
      });
    });
  }
}
