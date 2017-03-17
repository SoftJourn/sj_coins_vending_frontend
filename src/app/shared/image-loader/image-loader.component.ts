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


  //TODO use @ViewChildren. Make research
  imageComponents: UploadItemComponent[];
  //TODO rename image to cover
  image: HTMLImageElement;

  @ViewChild('imgList', {read: ViewContainerRef}) imgList;
  @ViewChild('modalImageCropper') cropper: ModalImgCropperComponent;

  height: number;
  width: number;

  private _defaultSource = "/assets/images/default-product-350x350.jpg";


  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private notify: NotificationsManager) {
    this.height = 205;
    this.width = 205;
  }

  ngOnInit() {
    this.imageComponents = [];
    this.setDefaultImage();
    this.cropper.visible = false;
    this.cropper.onCrop.subscribe((image) => this.addImageItem(image))
  }

  addImageItem(image: HTMLImageElement) {
    this.image = image;
    const factory = this.componentFactoryResolver.resolveComponentFactory(UploadItemComponent);
    const ref = this.imgList.createComponent(factory);
    this.imageComponents.push(ref.instance);
    ref.instance.image = image;
    ref.instance.onDelete.subscribe((next) => this.findAndDestroy(ref));
    ref.instance.onClick.subscribe((next) => this.image = ref.instance.image);
    ref.changeDetectorRef.detectChanges();
  }

  //TODO rename on file load
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

  /**
   * Form with cover file that was uploaded view model cropper
   * @param propertyName
   * @returns {FormData}
   */
  getImageFormData(propertyName: string): FormData {
    let formData = new FormData();
    let appended = ImageLoaderComponent.appendImageToFormData(formData, propertyName, this.image);
    if (!appended)
      return null;
    return formData;
  }


  /**
   * Create array of files that will be send to the server
   * @param propName
   * @returns {FormData} null in case if component is empty or all stored images loaded from server
   */
  getDescriptionImagesFormData(propName: string): FormData {
    let formData = new FormData();
    let isEmpty = true;
    for (let component of this.imageComponents) {
      let appended = ImageLoaderComponent.appendImageToFormData(formData, propName, component.image);
      isEmpty = isEmpty && !appended;
    }
    if (isEmpty)
      return null;
    return formData;
  }

  getDeletedUrls(originUrls: Array<string>): Array<string>{
    let storedArray = this.getStoredUrlsWithExternalSource();
    if(storedArray && originUrls)
      return originUrls.filter( url => storedArray.every(stored => stored.localeCompare(url) != 0));
    else
      return [];
  }

  getCoverBlobFile(): Blob {
    if(this.image && this.image.src && ImageLoaderComponent.isUrl(this.image.src)){
        return new Blob([this.image.src],{type:'image/jpeg'});
    }
  }

  private getStoredUrlsWithExternalSource(): Array<string> {
    return this.imageComponents
      .map(component => component.image.src)
      .filter(src => ImageLoaderComponent.isUrl(src))
  }

  private static isUrl(text : string): boolean{
    let externalUrlRegex = /https*:/i;
    return !!text.match(externalUrlRegex);
  }

  //TODO delete image item components
  reset() {

  }

  //TODO analyze if need to move this logic to parent component
  // + used only for edit and create. Less same code

  /**
   * @param formData
   * @param propName
   * @param image
   * @returns {boolean} Returns true if successfully created blob and append it to formData
   */
  private static appendImageToFormData(formData: FormData, propName: string, image: HTMLImageElement): boolean {
    try {
      let blob = ModalImgCropperComponent.dataURItoBlob(image.src);
      formData.append(propName, blob, image.name);
      return true;
    } catch (error) {
      return false;
    }
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

}
