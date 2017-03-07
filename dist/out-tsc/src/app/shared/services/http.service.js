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
import { Http } from "@angular/http";
import { TokenService } from "./token.service";
import { HttpHeaders } from "../http-headers";
export var HttpService = (function () {
    function HttpService(http, tokenService) {
        this.http = http;
        this.tokenService = tokenService;
    }
    HttpService.prototype.get = function (url) {
        var _this = this;
        return this.tokenService.getAuthHeaders()
            .flatMap(function (headers) { return _this.http.get(url, { headers: headers }); });
    };
    HttpService.prototype.post = function (url, body, contentType) {
        var _this = this;
        return this.tokenService.getAuthHeaders()
            .flatMap(function (headers) {
            if (contentType == null) {
                return _this.http.post(url, body, { headers: headers });
            }
            else {
                headers.append(HttpHeaders.CONTENT_TYPE, contentType);
                return _this.http.post(url, body, { headers: headers });
            }
        });
    };
    HttpService.prototype.put = function (url, body, contentType) {
        var _this = this;
        return this.tokenService.getAuthHeaders()
            .flatMap(function (headers) {
            headers.append(HttpHeaders.CONTENT_TYPE, contentType);
            return _this.http.put(url, body, { headers: headers });
        });
    };
    HttpService.prototype.delete = function (url) {
        var _this = this;
        return this.tokenService.getAuthHeaders()
            .flatMap(function (headers) { return _this.http.delete(url, { headers: headers }); });
    };
    HttpService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http, TokenService])
    ], HttpService);
    return HttpService;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/http.service.js.map