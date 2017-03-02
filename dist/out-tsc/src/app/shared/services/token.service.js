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
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { MediaType, HttpHeaders } from "../";
import { AppError } from "../app-error";
import { AppProperties } from "../app.properties";
import { Role } from "../entity/role";
export var TokenService = (function () {
    function TokenService(http) {
        this.http = http;
        this.STORAGE_KEY = 'tokens';
        if (this.isTokensExistsInStorage()) {
            var tokens = this.getTokensFromStorage();
            this.populateFields(tokens);
        }
    }
    TokenService.prototype.saveTokens = function (tokenResponse) {
        localStorage.setItem(this.STORAGE_KEY, tokenResponse);
        this.populateFields(tokenResponse);
    };
    TokenService.prototype.populateFields = function (tokenResponse) {
        var tokenRespJson = JSON.parse(tokenResponse);
        this.accessToken = tokenRespJson['access_token'];
        this.refreshToken = tokenRespJson['refresh_token'];
        this.tokenType = tokenRespJson['token_type'];
        this.expirationTime = TokenService.getExpirationTimeFromPayload(tokenRespJson['access_token']);
        this.scope = tokenRespJson['scope'];
        this.jti = tokenRespJson['jti'];
        this._authorities = JSON.parse(atob(this.accessToken.split('.', 2)[1])).authorities.map(function (a) { return new Role(a, false); });
    };
    TokenService.getExpirationTimeFromPayload = function (accessToken) {
        var payload = JSON.parse(atob(accessToken.split('.')[1]));
        return new Date((payload['exp'] - 30) * 1000);
    };
    TokenService.prototype.getAccessToken = function (credentials) {
        var _this = this;
        if (!this.accessToken && !credentials) {
            return Observable.throw(new AppError('token/access_token-missing', 'Access token is missing'));
        }
        else if (!this.accessToken && credentials) {
            return this.getTokens(credentials)
                .map(function (tokenResponse) {
                _this.saveTokens(tokenResponse);
                return _this.accessToken;
            });
        }
        else if (this.isAccessTokenExpired()) {
            return this.getTokensFromRefreshToken(this.refreshToken)
                .map(function (tokenResponse) {
                _this.saveTokens(tokenResponse);
                return _this.accessToken;
            });
        }
        else {
            return Observable.of(this.accessToken);
        }
    };
    TokenService.prototype.getTokenType = function () {
        if (!this.tokenType) {
            return null;
        }
        return this.tokenType;
    };
    TokenService.prototype.isAccessTokenExpired = function () {
        var now = new Date();
        return !!(this.expirationTime
            && now.getTime() > this.expirationTime.getTime());
    };
    TokenService.prototype.getTokensFromStorage = function () {
        return localStorage.getItem(this.STORAGE_KEY);
    };
    TokenService.prototype.isTokensExistsInStorage = function () {
        return !!localStorage.getItem(this.STORAGE_KEY);
    };
    TokenService.prototype.getTokens = function (credentials) {
        var grantType = "grant_type=password";
        var clientId = 'client_id=user_cred';
        var scope = 'scope=read write';
        var username = "username=" + credentials.username;
        var password = "password=" + credentials.password;
        var body = encodeURI(grantType + "&" + clientId + "&" + scope + "&" + username + "&" + password);
        var url = AppProperties.AUTH_ENDPOINT;
        return this.http.post(url, body, { headers: TokenService.getHeadersForTokenRequest() })
            .map(function (response) { return response.text(); });
    };
    TokenService.prototype.getTokensFromRefreshToken = function (refreshToken) {
        var url = AppProperties.AUTH_ENDPOINT;
        var grantType = 'grant_type=refresh_token';
        var refreshTokenParam = "refresh_token=" + refreshToken;
        var body = grantType + "&" + refreshTokenParam;
        return this.http.post(url, body, { headers: TokenService.getHeadersForTokenRequest() })
            .map(function (response) { return response.text(); });
    };
    TokenService.getHeadersForTokenRequest = function () {
        var headers = new Headers();
        headers.append(HttpHeaders.AUTHORIZATION, "Basic " + AppProperties.CLIENT_AUTH_HASH);
        headers.append(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED);
        return headers;
    };
    TokenService.prototype.deleteTokensFromStorage = function () {
        localStorage.removeItem(this.STORAGE_KEY);
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenType = null;
        this.expirationTime = null;
        this.scope = null;
        this.jti = null;
    };
    TokenService.prototype.getAuthHeaders = function () {
        var _this = this;
        return this.getAccessToken()
            .map(function (accessToken) {
            var headers = new Headers();
            var authValue = _this.getTokenType() + " " + accessToken;
            headers.append(HttpHeaders.AUTHORIZATION, authValue);
            return headers;
        });
    };
    TokenService.prototype.revokeRefreshToken = function () {
        var _this = this;
        if (!this.refreshToken) {
            return Observable.throw(new AppError('token/refresh_token-missing', 'Refresh token is missing'));
        }
        var url = AppProperties.AUTH_ENDPOINT + "/revoke";
        var body = "token_value=" + this.refreshToken;
        return this.getAuthHeaders().flatMap(function (headers) {
            headers.append(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED);
            return _this.http.post(url, body, { headers: headers });
        });
    };
    Object.defineProperty(TokenService.prototype, "authorities", {
        get: function () {
            return this._authorities;
        },
        enumerable: true,
        configurable: true
    });
    TokenService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http])
    ], TokenService);
    return TokenService;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/token.service.js.map