import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild } from '@angular/core';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { NotificationsManager } from '../../notifications.manager';
import { animate, AnimationEvent, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-modal-img-cropper',
  templateUrl: 'modal-img-cropper.component.html',
  styleUrls: ['modal-img-cropper.component.scss'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({transform: 'scale3d(.3, .3, .3)'}),
        animate(0)
      ]),
      transition('* => void', [
        animate(0, style({transform: 'scale3d(.0, .0, .0)'}))
      ])
    ])
  ]
})
export class ModalImgCropperComponent implements OnChanges, OnInit {

  data: any;
  cropperSettings: CropperSettings;

  @ViewChild('cropper') cropper: ImageCropperComponent;
  @Input() maxImageSize = 1024 * 512;
  //TODO reorganize position
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCrop: EventEmitter<HTMLImageElement> = new EventEmitter<HTMLImageElement>();
  @Input() cropImage: HTMLImageElement;

  constructor(private notify: NotificationsManager) {}

  ngOnInit(): void {
    const screenWidth = window.screen.availWidth;

    this.cropperSettings = new CropperSettings();
    if (screenWidth < 768) {
      this.cropperSettings.canvasWidth = 220;
      this.cropperSettings.canvasHeight = 200;
    } else {
      this.cropperSettings.canvasWidth = 500;
      this.cropperSettings.canvasHeight = 300;
    }
    this.cropperSettings.width = 600;
    this.cropperSettings.height = 600;

    this.cropperSettings.croppedWidth = 600;
    this.cropperSettings.croppedHeight = 600;

    this.cropperSettings.minWidth = 100;
    this.cropperSettings.minHeight = 100;
    this.cropperSettings.allowedFilesRegex = /image\/(?:jpeg|png|jpg|apng|svg|bmp)/;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(0,0,0,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.noFileInput = true;
    this.data = {};
  }

  animationDone(event: AnimationEvent) {
    if (this.cropImage && this.cropper) {
      this.cropper.setImage(this.cropImage);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cropImage && this.cropper) {
      this.cropper.setImage(this.cropImage);
    }
  }

  setImageData() {
    const resultImg = new Image();
    resultImg.src = this.data.image;
    resultImg.name = this.cropImage.name;
    this.close();
    if (this.hasValidSize(resultImg))
      this.onCrop.emit(resultImg);
    else
      this.notify.errorLargeImgSizeMsg();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  /**
   * This method return blob image in case of valid data:URL param
   * data:[<data type>][;base64],<data>
   * @throws Error in case not valid data:URL
   * @param dataURI
   * @returns {Blob}k
   */
  // TODO Set type depends on dataURI
  static dataURItoBlob(dataURI) {
    const splitter = ',';
    if (this.notValidDataURI(dataURI)) {
      const message = 'Data URI is not valid. Required format is data:[<data type>][;base64],<data>';
      throw Error(message);
    }
    const binary = atob(dataURI.split(splitter)[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }

  private static notValidDataURI(dataURI): boolean {
    const regex = /^data:(.*);base64,/i;
    const match = dataURI.match(regex);
    return !match;
  }

  private hasValidSize(image: HTMLImageElement): boolean {
    const blob = ModalImgCropperComponent.dataURItoBlob(image.src);
    return blob.size <= this.maxImageSize;
  }
}
