import { Role } from "./role";
export var Account = (function () {
    function Account(fistParam, fullName, email, authorities) {
        this.fullName = fullName;
        this.email = email;
        this.authorities = authorities;
        if (fistParam instanceof Object) {
            var obj = fistParam;
            if (Account.isValidInstance(obj)) {
                this.ldapId = obj['ldapId'];
                this.fullName = obj['fullName'];
                this.email = obj['email'];
                this.authorities = obj['authorities'].map(function (role) { return new Role(role); });
            }
            else {
                return null;
            }
        }
        else {
            this.ldapId = fistParam;
        }
    }
    Account.isValidInstance = function (obj) {
        var hasAllProperties = obj.hasOwnProperty("ldapId")
            && obj.hasOwnProperty("fullName")
            && obj.hasOwnProperty("email")
            && obj.hasOwnProperty("authorities");
        if (!hasAllProperties)
            return false;
        var typeAccordance = typeof (obj['ldapId']) == "string"
            && typeof (obj['fullName']) == "string"
            && typeof (obj['email']) == "string"
            && typeof (obj['authorities']) == "object"
            && obj['authorities'] instanceof Array;
        if (!typeAccordance)
            return false;
        var array = obj['authorities'];
        return array.every(function (role) { return Role.isValid(role); });
    };
    Account.prototype.hasRole = function (role) {
        if (typeof this.authorities == 'undefined' || this.authorities == null)
            return false;
        return this.authorities.some(function (r) { return r.authority == role; });
    };
    Account.prototype.setRole = function (roleName, active) {
        if (typeof this.authorities == 'undefined' || this.authorities == null)
            this.authorities = [];
        var index = -1;
        for (var i = 0; i < this.authorities.length; i++) {
            if (this.authorities[i].authority == roleName) {
                index = i;
                break;
            }
        }
        if (active && index < 0) {
            this.authorities.push(new Role(roleName, false));
        }
        if (!active && index > -1) {
            this.authorities.splice(index, 1);
        }
    };
    Account.prototype.isSuperUser = function () {
        var isSuper = false;
        for (var i = 0; i < this.authorities.length; i++) {
            if (this.authorities[i].superRole == true) {
                isSuper = true;
                break;
            }
        }
        return isSuper;
    };
    Account.prototype.getRole = function () {
        var regex = /.*ROLE_/;
        var result = [];
        if (this.authorities)
            this.authorities.forEach(function (role) { return result.push(role.authority.replace(regex, '').replace(/_/, ' ')); });
        return result.toString().replace(/,/g, ', ');
    };
    Account.prototype.toString = function () {
        return JSON.stringify(this);
    };
    return Account;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/entity/account.js.map