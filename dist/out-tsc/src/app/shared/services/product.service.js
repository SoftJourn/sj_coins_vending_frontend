var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { AppProperties } from "../app.properties";
import { CrudService } from "./crud.service";
import { Http, ResponseContentType, Headers } from "@angular/http";
export var ProductService = (function (_super) {
    __extends(ProductService, _super);
    function ProductService(http, httpService) {
        _super.call(this, httpService);
        this.http = http;
        this.httpService = httpService;
    }
    ProductService.prototype.getUrl = function () {
        return AppProperties.API_VENDING_ENDPOINT + "/products";
    };
    ProductService.prototype.findAllThatContainByName = function (name) {
        return this.httpService.get(this.getUrl() + '/search?name=' + name).map(function (response) {
            return response.json();
        });
    };
    ProductService.prototype.updateImage = function (id, file) {
        var url = this.getUrl() + "/" + id + "/image";
        return this.httpService.post(url, file)
            .flatMap(function (response) { return Observable.empty(); });
    };
    ProductService.prototype.updateImages = function (id, file) {
        var url = this.getUrl() + "/" + id + "/images";
        return this.httpService.post(url, file)
            .flatMap(function (response) { return Observable.empty(); });
    };
    ProductService.prototype.deleteImage = function (url) {
        return this.httpService.delete(url)
            .flatMap(function (response) { return Observable.empty(); });
    };
    //TODO Remove this method and related. This is temporary solution
    ProductService.prototype.getImageBlob = function (url) {
        var header = new Headers();
        header.append('Content-Type', 'image/jpg');
        return this.http.get(url, {
            headers: header, responseType: ResponseContentType.Blob
        }).map(function (response) { return response.blob(); });
    };
    ProductService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http, HttpService])
    ], ProductService);
    return ProductService;
}(CrudService));
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/product.service.js.map