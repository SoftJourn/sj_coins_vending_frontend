import {
  Component,
  Input,
  Output,
  EventEmitter,
  trigger,
  style,
  animate,
  transition,
  ViewChild,
  Type,
  AnimationTransitionEvent, OnChanges, SimpleChanges, OnInit
} from "@angular/core";
import {ImageCropperComponent, CropperSettings} from "ng2-img-cropper";
import {NotificationsManager} from "../../notifications.manager";

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
export class ModalImgCropperComponent extends Type implements OnChanges {

  data: any;
  cropperSettings: CropperSettings;

  @ViewChild('cropper') cropper: ImageCropperComponent;
  @Input() maxImageSize = 1024 * 256;
  //TODO reorganize position
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCrop: EventEmitter<HTMLImageElement> = new EventEmitter<HTMLImageElement>();
  @Input() cropImage: HTMLImageElement;

  constructor(private notify: NotificationsManager) {

    super();
    let screenWidth = window.screen.availWidth;

    this.cropperSettings = new CropperSettings();
    if (screenWidth < 768) {
      this.cropperSettings.canvasWidth = 220;
      this.cropperSettings.canvasHeight = 200;
    } else {
      this.cropperSettings.canvasWidth = 500;
      this.cropperSettings.canvasHeight = 300;
    }
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;

    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;

    this.cropperSettings.minWidth = 100;
    this.cropperSettings.minHeight = 100;
    this.cropperSettings.allowedFilesRegex = /image\/(?:jpeg|png|jpg|apng|svg|bmp)/;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(0,0,0,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.noFileInput = true;
    this.data = {};
  }

  animationDone(event: AnimationTransitionEvent) {
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
    let resultImg = new Image();
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
    let splitter = ',';
    if (this.notValidDataURI(dataURI)) {
      let message = "Data URI is not valid. Required format is data:[<data type>][;base64],<data>";
      throw Error(message);
    }
    let binary = atob(dataURI.split(splitter)[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }

  private static notValidDataURI(dataURI): boolean {
    let regex = /^data:(.*);base64,/i;
    let match = dataURI.match(regex);
    return !match;
  }

  private hasValidSize(image: HTMLImageElement): boolean {
    let blob = ModalImgCropperComponent.dataURItoBlob(image.src);
    return blob.size <= this.maxImageSize;
  }
}
