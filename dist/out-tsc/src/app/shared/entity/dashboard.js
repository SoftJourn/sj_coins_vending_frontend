export var Dashboard = (function () {
    function Dashboard(products, machines, categories, purchases) {
        if (products === void 0) { products = 0; }
        if (machines === void 0) { machines = 0; }
        if (categories === void 0) { categories = 0; }
        if (purchases === void 0) { purchases = 0; }
        this.products = products;
        this.machines = machines;
        this.categories = categories;
        this.purchases = purchases;
    }
    return Dashboard;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/entity/dashboard.js.map