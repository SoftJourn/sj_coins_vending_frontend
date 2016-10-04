import {Injectable} from '@angular/core';
import {NotificationsService} from "angular2-notifications/components";

@Injectable()
export class ImageUploadService {

    private loaded: boolean = false;
    private imageName: string = '';
    private img;
    public defaultImageSrc = '/assets/images/default-product-350x350.jpg';
    public formData: FormData = null;
    public imageSrc: string;
    public imageFile: File = null;
    public imageLoaded: boolean = false;

    constructor(private notificationService: NotificationsService) {
    }

    public handleInputChange(e) {
        this.imageFile = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        var pattern = /image\/(?:jpeg|png|jpg|apng|svg|bmp)/;
        var reader = new FileReader();
        this.validImageDimensions(this.imageFile).then(resolve => {
            // check image pattern
            if (!this.imageFile.type.match(pattern)) {
                this.notificationService.error('Error', 'This file format not supported!');
                this.cleanImageData();
                e.target.value = null;
            }
            // check image size
            else if (this.imageFile.size > 1024 * 256) {
                this.notificationService.error('Error', 'This image size is too big!');
                this.cleanImageData();
                e.target.value = null;
            }
            // check image dimensions
            else if (resolve) {
                this.notificationService.error('Error', 'Image dimensions is too big, try to use 205*205px');
                e.target.value = null;
                this.cleanImageData();
            } else {
                this.loaded = false;
                this.formData = new FormData();
                this.formData.append('file', this.imageFile, this.imageFile.name);
                reader.onload = this._handleReaderLoaded.bind(this);
                reader.readAsDataURL(this.imageFile);
                this.imageName = this.imageFile.name;
                e.target.value = null;
            }
        }, reject => {
            this.notificationService.error('Error', reject);
            this.cleanImageData();
            e.target.value = null;
        });
    }

    public handleImageLoad() {
        this.imageLoaded = true;
    }

    private _handleReaderLoaded(e) {
        var reader = e.target;
        this.imageSrc = reader.result;
        this.loaded = true;
    }

    private validImageDimensions(image: File): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.onload = ()=> {
                resolve(this.img.width >= 205 || this.img.height >= 205);
                reject('Image was not uploaded, try again!');
            };
            this.img.src = window.URL.createObjectURL(image);
        });
    }

    public cleanImageData(): void {
        this.imageFile = null;
        this.imageName = '';
        this.formData = null;
    }
}
