export var AddMenu = (function () {
    function AddMenu() {
        this.iconState = false;
        this.visible = false;
    }
    AddMenu.prototype.spinPlusIcon = function () {
        this.iconState = !this.iconState;
    };
    AddMenu.prototype.changeVisibility = function (visibility) {
        this.visible = visibility;
    };
    AddMenu.prototype.getMenuButtonName = function () {
        return this.visible ? "Cancel" : "Add";
    };
    return AddMenu;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/entity/add-menu.js.map