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
  AnimationTransitionEvent
} from "@angular/core";
import {ImageCropperComponent, CropperSettings} from "ng2-img-cropper";
import {NotificationsService} from "angular2-notifications/components";
import {NotificationsManager} from "../notifications.manager";

@Component({
    selector: 'app-modal-img-cropper',
    templateUrl: './modal-img-cropper.component.html',
    styleUrls: ['./modal-img-cropper.component.scss'],
    animations: [
        trigger('dialog', [
            transition('void => *', [
                style({transform: 'scale3d(.3, .3, .3)'}),
                animate(100)
            ]),
            transition('* => void', [
                animate(100, style({transform: 'scale3d(.0, .0, .0)'}))
            ])
        ])
    ]
})
export class ModalImgCropperComponent extends Type {

    data: any;
    cropperSettings: CropperSettings;

    @ViewChild('cropper') cropper: ImageCropperComponent;

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


  setImageData() {
          let resultImg = new Image();
          resultImg.src = this.data.image;
          resultImg.name = this.cropImage.name;
          this.onCrop.emit(resultImg);
        this.close();
  }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

}
