var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { NotificationsService } from "angular2-notifications/components";
import { Observable } from "rxjs";
export var ImageUploadService = (function () {
    function ImageUploadService(notificationService) {
        this.notificationService = notificationService;
        this.loaded = false;
        this.imageName = null;
        this.defaultImageSrc = '/assets/images/default-product-350x350.jpg';
        this.formData = null;
        this.imageSrc = null;
        this.imageFile = null;
        this.imageLoaded = false;
        this.imgFileForCroper = null;
    }
    ImageUploadService.prototype.fileChangeListener = function ($event) {
        var self = this;
        return Observable.create(function (subscriber) {
            self.imageFile = $event.dataTransfer ? $event.dataTransfer.files[0] : $event.target.files[0];
            var pattern = /image\/(?:jpeg|png|jpg|apng|svg|bmp)/;
            var myReader = new FileReader();
            // check image pattern
            if (!self.imageFile.type.match(pattern)) {
                self.notificationService.error('Error', 'This file format not supported!');
                self.cleanImageData();
                $event.target.value = null;
                subscriber.error('This file format not supported!');
            }
            else {
                self.loaded = false;
                myReader.onloadend = function (e) {
                    var src = self._handleReaderLoaded(e);
                    var name = self.imageFile.name;
                    subscriber.next({ 'src': src, 'name': name });
                    subscriber.complete();
                };
                myReader.readAsDataURL(self.imageFile);
                $event.target.value = null;
            }
        });
    };
    ImageUploadService.prototype.handleImageLoad = function () {
        this.imageLoaded = true;
    };
    ImageUploadService.prototype.dataURItoBlob = function (dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    };
    ImageUploadService.prototype._handleReaderLoaded = function (e) {
        var reader = e.target;
        this.imgFileForCroper = reader.result;
        this.loaded = true;
        return this.imgFileForCroper;
    };
    ImageUploadService.prototype.cleanImageData = function () {
        this.imageFile = null;
        this.imageName = null;
        this.formData = null;
    };
    ImageUploadService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [NotificationsService])
    ], ImageUploadService);
    return ImageUploadService;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/image-upload.service.js.map