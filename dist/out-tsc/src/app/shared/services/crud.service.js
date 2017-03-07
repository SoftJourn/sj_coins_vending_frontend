import { Observable } from "rxjs";
import { MediaType } from "../media-type";
export var CrudService = (function () {
    function CrudService(httpService, proto) {
        this.httpService = httpService;
        this.proto = proto;
    }
    CrudService.prototype.genericFindAll = function () {
        return this.httpService.get(this.getUrl())
            .map(function (response) {
            var json = response.json();
            var temp;
            json.map(function (obj) {
                temp = obj;
                return temp;
            });
            return json;
        });
    };
    CrudService.prototype.findAll = function () {
        var _this = this;
        if (this.proto) {
            return this.httpService.get(this.getUrl())
                .map(function (response) { return response.json()
                .map(function (obj) {
                obj.__proto__ = _this.proto;
                return obj;
            }); });
        }
        else {
            return this.httpService.get(this.getUrl()).map(function (response) { return response.json(); });
        }
    };
    CrudService.prototype.findOne = function (id) {
        var url = this.getUrl() + "/" + id;
        return this.httpService.get(url)
            .map(function (response) { return response.json(); });
    };
    CrudService.prototype.save = function (entity) {
        return this.httpService.post(this.getUrl(), entity, MediaType.APPLICATION_JSON)
            .map(function (response) { return response.json(); });
    };
    CrudService.prototype.delete = function (id) {
        var url = this.getUrl() + "/" + id;
        return this.httpService.delete(url)
            .flatMap(function (response) { return Observable.empty(); });
    };
    CrudService.prototype.update = function (id, entity) {
        var url = this.getUrl() + "/" + id;
        return this.httpService.post(url, entity, MediaType.APPLICATION_JSON)
            .map(function (response) { return response.json(); });
    };
    return CrudService;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/services/crud.service.js.map