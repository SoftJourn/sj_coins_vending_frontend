export var CoinsAccount = (function () {
    function CoinsAccount(ldapId, amount, fullName, isNew) {
        this.ldapId = ldapId;
        this.amount = amount;
        this.fullName = fullName;
        this.isNew = isNew;
    }
    return CoinsAccount;
}());
export var AccountType = (function () {
    function AccountType(type) {
        this.type = type;
    }
    return AccountType;
}());
export var REGULAR = new AccountType('regular');
export var MERCHANT = new AccountType('merchant');
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/coin-management/coins-account.js.map