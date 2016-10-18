import {Injectable} from '@angular/core';
import {NotificationsService} from "angular2-notifications/components";
import {Observable} from "rxjs";

@Injectable()
export class ImageUploadService {


    private loaded: boolean = false;
    public imageName: string = null;
    public defaultImageSrc = '/assets/images/default-product-350x350.jpg';
    public formData: FormData = null;
    public imageSrc: string = null;
    public imageFile: File = null;
    public imageLoaded: boolean = false;
    public imgFileForCroper = null;

    constructor(private notificationService: NotificationsService) {
    }

    public fileChangeListener($event) {
        let self = this;
        return Observable.create(function (subscriber) {
            self.imageFile = $event.dataTransfer ? $event.dataTransfer.files[0] : $event.target.files[0];
            var pattern = /image\/(?:jpeg|png|jpg|apng|svg|bmp)/;
            var myReader: FileReader = new FileReader();
            // check image pattern
            if (!self.imageFile.type.match(pattern)) {
                self.notificationService.error('Error', 'This file format not supported!');
                self.cleanImageData();
                $event.target.value = null;

                subscriber.error('This file format not supported!');
            }
            // check image size
            else if ( self.imageFile.size > 1024 * 256) {
                self.notificationService.error('Error', 'This image size is too big!');
                self.cleanImageData();
                $event.target.value = null;
            }
            // check image dimensions
            else {
                self.loaded = false;

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

    public dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    }

    private _handleReaderLoaded(e) {
        var reader = e.target;
        this.imgFileForCroper = reader.result;
        this.loaded = true;

        return this.imgFileForCroper;
    }

    public cleanImageData(): void {
        this.imageFile = null;
        this.imageName = null;
        this.formData = null;
    }
}