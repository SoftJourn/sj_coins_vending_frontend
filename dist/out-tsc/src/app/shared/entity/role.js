export var Role = (function () {
    function Role(authority, superRole) {
        this.superRole = superRole;
        if (authority instanceof Object) {
            var obj = authority;
            this.constructor.apply(this, [obj['authority'], obj['superRole']]);
        }
        else {
            this.authority = authority;
            if (!superRole) {
                this.superRole = false;
            }
        }
    }
    Role.prototype.toString = function () {
        return this.authority;
    };
    Role.isValid = function (role) {
        return true;
    };
    return Role;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/entity/role.js.map