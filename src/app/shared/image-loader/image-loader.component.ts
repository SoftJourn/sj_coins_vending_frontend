import {Component, OnInit, ViewContainerRef, ComponentFactoryResolver, ViewChild, ComponentRef} from "@angular/core";
import {UploadItemComponent} from "./upload-item/upload-item.component";
import {ModalImgCropperComponent} from "../modal-img-cropper/modal-img-cropper.component";
import {NotificationsManager} from "../notifications.manager";

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.scss']
})
export class ImageLoaderComponent implements OnInit {


  imageComponents: UploadItemComponent[];
  image: HTMLImageElement;

  @ViewChild('imgList', {read: ViewContainerRef}) imgList;
  @ViewChild('modalImageCropper') cropper: ModalImgCropperComponent;

  height: number;
  width: number;

  private _maxImageSize = 1024 * 256;
  private _defaultSource = "/assets/images/default-product-350x350.jpg";

  private static dataURItoBlob(dataURI) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private notify: NotificationsManager) {
    this.height = 205;
    this.width = 205;
  }

  ngOnInit() {
    this.imageComponents = [];
    this.setDefaultImage();
    this.cropper.visible = false;
    this.cropper.onCrop.subscribe((image) => this.handleCropImage(image))
  }

  addImageItem(image: HTMLImageElement) {
    this.hasValidSize(image);
    this.image = image;
    const factory = this.componentFactoryResolver.resolveComponentFactory(UploadItemComponent);
    const ref = this.imgList.createComponent(factory);
    this.imageComponents.push(ref.instance);
    ref.instance.image = image;
    ref.instance.onDelete.subscribe((next) => this.findAndDestroy(ref));
    ref.instance.onClick.subscribe((next) => this.image = ref.instance.image);
    ref.changeDetectorRef.detectChanges();
  }

  acceptFile($event) {
    let imageFile = $event.dataTransfer ? $event.dataTransfer.files[0] : $event.target.files[0];
    let reader: FileReader = new FileReader();
    let image = new Image();
    let self = this;
    image.name = imageFile.name;
    reader.readAsDataURL(imageFile);
    reader.onloadend = function (e) {
      image.src = reader.result;
      self.setUpCropper(image);
    };
    // Without this line event would not fire for the same file
    $event.target.value = null;
  }

  isEmpty(): boolean {
    return this.imageComponents.length <= 0;
  }

  getImageFormData(propertyName: string) {
    let formData = new FormData();
    this.appendImageToFormData(formData,'file', this.image);
    return formData;
  }

  getDescriptionImagesFormData(propName: string) {
    let formData = new FormData();
    for(let component of this.imageComponents){
      this.appendImageToFormData(formData, propName, component.image);
    }
    return formData;
  }

  private appendImageToFormData(formData: FormData, propName: string, image: HTMLImageElement) {
    let blob = ImageLoaderComponent.dataURItoBlob(image.src);
    return formData.append(propName, blob, image.name);
  }

  private setUpCropper(image: HTMLImageElement) {
    this.cropper.cropImage = image;
    this.cropper.visible = true;
  }

  private setDefaultImage(): HTMLImageElement {
    this.image = new Image(this.width, this.height);
    this.image.src = this._defaultSource;
    return this.image;
  }

  private findAndDestroy(ref: ComponentRef<UploadItemComponent>) {
    this.imageComponents = this.imageComponents.filter((component) => component !== ref.instance);
    if (this.image == ref.instance.image) {
      if (this.imageComponents.length == 0)
        this.setDefaultImage();
      else
        this.image = this.imageComponents[0].image;
    }
    ref.destroy();
  }

  private hasValidSize(image: HTMLImageElement): boolean {
    let blob = ImageLoaderComponent.dataURItoBlob(image.src);
    return blob.size <= this._maxImageSize;
  }

  private handleCropImage(image: any) {
    if (this.hasValidSize(image))
      this.addImageItem(image);
    else
      this.notify.errorLargeImgSizeMsg();
  }
}
