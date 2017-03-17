import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {NotificationsManager} from "../notifications.manager";

@Injectable()
export class ImageUploadService {

  private static _maxImageSize = 1024 * 256;

    imageName: string = null;
    defaultImageSrc = '/assets/images/default-product-350x350.jpg';
    formData: FormData = null;
    imageSrc: string = null;
    imageFile: File = null;
    imageLoaded: boolean = false;
    imgFileForCroper = null;

  private _loaded: boolean = false;
  private _imageRegExp = /image\/(?:jpeg|png|jpg|apng|svg|bmp)/;
  static dataURItoBlob(dataURI) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }
  constructor(private notify: NotificationsManager) {
    }

  public fileChangeListener($event) {
        let self = this;
        return Observable.create(function (subscriber) {
            self.imageFile = $event.dataTransfer ? $event.dataTransfer.files[0] : $event.target.files[0];
            let myReader: FileReader = new FileReader();
            // check image pattern
            if (!self.imageFile.type.match(this._imageRegExp)) {
                self.notify.errorWrongFormatMsg();
                self.cleanImageData();
                $event.target.value = null;

                subscriber.error(NotificationsManager.errorWrongFormatMsg);
            }
            else {
                self._loaded = false;

                myReader.onloadend = function (e) {
                    let src = self._handleReaderLoaded(e);
                    let name = self.imageFile.name;
                    subscriber.next({'src': src, 'name': name});
                    subscriber.complete();
                };
                myReader.readAsDataURL(self.imageFile);
                $event.target.value = null;
            }
        });
    }

    public handleImageLoad() {
        this.imageLoaded = true;
    }


    public cleanImageData(): void {
        this.imageFile = null;
        this.imageName = null;
        this.formData = null;
    }

  private _handleReaderLoaded(e) {
    let reader = e.target;
    this.imgFileForCroper = reader.result;
    this._loaded = true;

    return this.imgFileForCroper;
  }

  static isImageSizeAcceptable(image: any): boolean {
    return true;
  }
}
