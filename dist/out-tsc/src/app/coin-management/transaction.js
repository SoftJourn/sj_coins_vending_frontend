export var Transaction = (function () {
    function Transaction(id, account, destination, amount, comment, created, status, remain, error) {
        this.id = id;
        this.account = account;
        this.destination = destination;
        this.amount = amount;
        this.comment = comment;
        this.created = created;
        this.status = status;
        this.remain = remain;
        this.error = error;
    }
    return Transaction;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/coin-management/transaction.js.map