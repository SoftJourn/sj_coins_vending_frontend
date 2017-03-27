import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";

@Component({
  selector: 'app-upload-item',
  templateUrl: 'upload-item.component.html',
  styleUrls: ['upload-item.component.scss']
})
export class UploadItemComponent implements OnInit {

  @Input() image: HTMLImageElement;

  @Output() onDelete = new EventEmitter();
  @Output() onClick = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  destroy() {
    this.onDelete.emit();
  }

  select() {
    this.onClick.emit();
  }

}
