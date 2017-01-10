export var GlobalErrorHandler = (function () {
    function GlobalErrorHandler() {
    }
    GlobalErrorHandler.prototype.handleError = function (error) {
        console.log(this.constructor.name);
        console.log(error);
    };
    return GlobalErrorHandler;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/global-error-handler.js.map