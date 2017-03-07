export var Machine = (function () {
    function Machine(id, name, url, uniqueId, rows, size, isActive) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.uniqueId = uniqueId;
        this.rows = rows;
        this.size = size;
        this.isActive = isActive;
    }
    return Machine;
}());
export var Row = (function () {
    function Row(id, rowId, fields) {
        this.id = id;
        this.rowId = rowId;
        this.fields = fields;
    }
    return Row;
}());
export var Field = (function () {
    function Field(id, internalId, position, count, product) {
        if (count === void 0) { count = 0; }
        this.id = id;
        this.internalId = internalId;
        this.position = position;
        this.count = count;
        this.product = product;
    }
    return Field;
}());
export var MachineSize = (function () {
    function MachineSize(rows, columns, cellLimit) {
        this.rows = rows;
        this.columns = columns;
        this.cellLimit = cellLimit;
    }
    return MachineSize;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/machines/shared/machine.js.map