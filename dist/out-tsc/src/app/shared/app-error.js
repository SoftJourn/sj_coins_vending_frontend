export var AppError = (function () {
    function AppError(code, message) {
        if (code === void 0) { code = ''; }
        if (message === void 0) { message = ''; }
        this.code = code;
        this.message = message;
    }
    return AppError;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/app-error.js.map