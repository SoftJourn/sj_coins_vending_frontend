export var Transaction = (function () {
    function Transaction(id, account, destination, amount, comment, created, status, error) {
        this.id = id;
        this.account = account;
        this.destination = destination;
        this.amount = amount;
        this.comment = comment;
        this.created = created;
        this.status = status;
        this.error = error;
    }
    return Transaction;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/entity/transaction.js.map